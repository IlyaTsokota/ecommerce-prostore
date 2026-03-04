"use server";

import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getMyCart } from "../../cart/actions/cart.actions";
import { getUserById } from "../../user/actions/user.actions";
import { CreateOrderSchema } from "../schemas/order.schema";
import prisma from "@/db/prisma";
import { Order, PaymentResult } from "../types/order.types";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "@/lib/constants";

export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error("User is not authenticated");

        const userId = session?.user?.id;
        const user = await getUserById(userId);
        const cart = await getMyCart();

        if (!cart || !cart.items.length) {
            return { success: false, message: "Your cart is empty", redirectTo: "/cart" };
        }

        if (!user.address) {
            return {
                success: false,
                message: "No shipping address",
                redirectTo: "/shipping-address",
            };
        }

        if (!user.paymentMethod) {
            return {
                success: false,
                message: "No payment method",
                redirectTo: "/payment-method",
            };
        }

        const order = await CreateOrderSchema.parseAsync({
            userId,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        const createdOrderId = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({ data: order });

            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: { ...item, price: item.price, orderId: createdOrder.id },
                });
            }

            await tx.cart.update({
                where: { id: cart.id },
                data: { items: [], totalPrice: 0, taxPrice: 0, shippingPrice: 0, itemsPrice: 0 },
            });

            return createdOrder.id;
        });

        if (!createdOrderId) {
            throw new Error("Order not created");
        }

        return { success: true, message: "Order created", redirectTo: `/order/${createdOrderId}` };
    } catch (error) {
        if (isRedirectError(error)) throw error;

        return { success: false, message: formatError(error) };
    }
}

export async function getOrderById(id: string): Promise<Order> {
    const data = await prisma.order.findFirst({
        where: { id },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    });

    return convertToPlainObject(data);
}

export async function createPayPalOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });

        if (order) {
            const paypalOrder = await paypal.createOrder(order.totalPrice.toString());

            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: "",
                        status: "",
                        pricePaid: 0,
                    },
                },
            });

            console.log(paypalOrder);

            return {
                success: true,
                message: "Item order created successfully",
                data: paypalOrder.id,
            };
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function approvePayPalOrder(orderId: string, data: { orderId: string }) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        const captureData = await paypal.capturePayment(data.orderId);

        if (
            !captureData ||
            captureData.id !== (order.paymentResult as PaymentResult)?.id ||
            captureData.status !== "COMPLETED"
        ) {
            throw new Error("Error in PayPal payment");
        }

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
                email_address: captureData.payer.email_address,
            },
        });

        revalidatePath(`/order/${orderId}`);

        return {
            success: true,
            message: "You order has been paid",
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

async function updateOrderToPaid({
    orderId,
    paymentResult,
}: {
    orderId: string;
    paymentResult?: PaymentResult;
}) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.isPaid) {
        throw new Error("Order is already paid");
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } },
            });
        }

        return await tx.order.update({
            where: { id: orderId },
            data: { isPaid: true, paidAt: new Date(), paymentResult },
            include: {
                orderItems: true,
                user: { select: { name: true, email: true } },
            },
        });
    });

    if (!updatedOrder) throw new Error("Order not found");

    return updatedOrder;
}

export async function getMyOrders(
    page: number,
    limit = PAGE_SIZE,
): Promise<{ data: Order[]; totalPages: number }> {
    const session = await auth();

    if (!session) throw new Error("User is not authorized");

    const data = await prisma.order.findMany({
        where: { userId: session?.user?.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.order.count({
        where: { userId: session?.user?.id },
    });

    return {
        data: convertToPlainObject(data),
        totalPages: Math.ceil(dataCount / limit),
    };
}

export type SalesDataType = {
    month: string;
    totalSales: number;
};

export async function getOrderSummary() {
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    const totalSales = await prisma.order.aggregate({
        _sum: { totalPrice: true },
    });

    const salesDataRaw = await prisma.$queryRaw<
        Array<SalesDataType>
    >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

    const salesData: SalesDataType[] = salesDataRaw.map((entry) => ({
        month: entry.month,
        totalSales: Number(entry.totalSales),
    }));

    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
        take: 6,
    });

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        salesData,
        latestSales,
    };
}
