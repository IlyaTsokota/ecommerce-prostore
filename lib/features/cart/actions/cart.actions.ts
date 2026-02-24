"use server";

import { convertToPlainObject, formatError, round2 } from "@/lib/utils";
import { Cart, CartItem } from "../types/cart.types";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { CartItemSchema, CreateCartSchema } from "../schemas/cart.schemas";
import { revalidatePath } from "next/cache";

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

export async function addItemToCart(data: CartItem) {
    try {
        const item = await CartItemSchema.parseAsync(data);
        const cart = await getMyCart();
        const product = await prisma.product.findFirst({ where: { id: item.productId } });

        if (!product) throw new Error("Product not found");

        if (!cart) {
            const sessionCartId = (await cookies()).get("sessionCartId")?.value;

            if (!sessionCartId) throw new Error("Cart session not found");

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
        }

        return {
            success: true,
            message: "Item added to cart",
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: formatError(error),
        };
    }
}

export async function getMyCart(): Promise<Cart | null> {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

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
