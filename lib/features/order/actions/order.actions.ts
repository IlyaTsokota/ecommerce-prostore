"use server";

import { auth } from "@/auth";
import { formatError } from "@/lib/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getMyCart } from "../../cart/actions/cart.actions";
import { getUserById } from "../../user/actions/user.actions";
import { CreateOrderSchema } from "../schemas/order.schema";
import prisma from "@/db/prisma";

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
