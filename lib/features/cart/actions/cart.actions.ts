"use server";

import { convertToPlainObject, formatError, round2 } from "@/lib/utils";
import { Cart, CartItem } from "../types/cart.types";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { CartItemSchema, CreateCartSchema } from "../schemas/cart.schemas";
import { revalidatePath } from "next/cache";

const getSessionCartId = async () => {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    return sessionCartId;
};

const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0));
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
    const taxPrice = round2(0.15 * itemsPrice);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    };
};

export async function getMyCart(): Promise<Cart | null> {
    const sessionCartId = await getSessionCartId();

    const session = await auth();
    const userId = session?.user?.id || undefined;
    const cart = await prisma.cart.findFirst({
        where: userId
            ? {
                  userId,
              }
            : {
                  sessionCartId,
              },
    });

    if (!cart) return null;

    return convertToPlainObject(cart);
}

export async function addItemToCart(data: CartItem) {
    try {
        const item = await CartItemSchema.parseAsync(data);
        const product = await prisma.product.findFirst({ where: { id: item.productId } });

        if (!product) throw new Error("Product not found");

        const cart = await getMyCart();

        if (!cart) {
            const sessionCartId = await getSessionCartId();
            const session = await auth();
            const userId = session?.user?.id || undefined;

            const newCart = await CreateCartSchema.parseAsync({
                userId,
                items: [item],
                sessionCartId,
                ...calcPrice([item]),
            });

            await prisma.cart.create({
                data: newCart,
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} added to cart`,
            };
        } else {
            const existItemIndex = cart.items.findIndex(
                (cartItem) => cartItem.productId === item.productId,
            );

            if (existItemIndex !== -1) {
                if (product.stock < cart.items[existItemIndex].qty + 1) {
                    throw new Error("Not enough stock");
                }

                cart.items[existItemIndex].qty += 1;
            } else {
                if (product.stock < 1) {
                    throw new Error("Not enough stock");
                }

                cart.items.push(item);
            }

            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items,
                    ...calcPrice(cart.items),
                },
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${existItemIndex !== -1 ? "updated in" : "added to"} cart`,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}

export async function removeItemFormCart(productId: string) {
    try {
        const product = await prisma.product.findFirst({ where: { id: productId } });

        if (!product) throw new Error("Product not found");

        const cart = await getMyCart();

        if (!cart) throw new Error("Cart not found");

        const existItemIndex = cart.items.findIndex((cartItem) => cartItem.productId === productId);

        if (existItemIndex === -1) {
            throw new Error("Item not found");
        }

        if (cart.items[existItemIndex].qty === 1) {
            cart.items = cart.items.filter((cartItem) => cartItem.productId !== productId);
        } else {
            cart.items[existItemIndex].qty -= 1;
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items,
                ...calcPrice(cart.items),
            },
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.name} was remove from cart`,
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}
