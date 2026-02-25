"use server";

import prisma from "@/db/prisma";
import { ShippingAddress } from "../../cart/types/cart.types";
import { formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { ShippingAddressSchema } from "../../cart/schemas/cart.schemas";

export async function getUserById(id: string) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) throw new Error("User not found");

    return user;
}

export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({ where: { id: session?.user?.id } });

        if (!currentUser) {
            throw new Error("User not found");
        }

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
