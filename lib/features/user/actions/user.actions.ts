"use server";

import prisma from "@/db/prisma";
import { ShippingAddress } from "../../cart/types/cart.types";
import { formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { ShippingAddressSchema } from "../../cart/schemas/cart.schemas";
import { PaymentMethodSchema } from "../../order/schemas/order.schema";
import z from "zod";

export async function getUserById(id?: string) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) throw new Error("User not found");

    return user;
}

export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();
        const currentUser = await getUserById(session?.user?.id);
        const address = await ShippingAddressSchema.parseAsync(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                address,
            },
        });

        return { success: true, message: "User updated successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateUserPaymentMethod(data: z.infer<typeof PaymentMethodSchema>) {
    try {
        const session = await auth();
        const currentUser = await getUserById(session?.user?.id);

        const paymentMethod = await PaymentMethodSchema.parseAsync(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type },
        });

        return { success: true, message: "User updated successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateUserProfile({ email, name }: { email: string; name: string }) {
    try {
        const session = await auth();
        const currentUser = await getUserById(session?.user?.id);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { email, name },
        });

        return { success: true, message: "User updated successfully" };
    } catch (err) {
        return { success: false, message: formatError(error) };
    }
}
