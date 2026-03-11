"use server";

import prisma from "@/db/prisma";
import { ShippingAddress } from "../../cart/types/cart.types";
import { formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { ShippingAddressSchema } from "../../cart/schemas/cart.schemas";
import { PaymentMethodSchema } from "../../order/schemas/order.schema";
import z from "zod";
import { PAGE_SIZE } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { UpdateUserSchema } from "../schemas/user.schema";
import { Role } from "@/lib/generated/prisma/enums";

export async function getUserById(id?: string) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) throw new Error("User not found");

    return user;
}

export async function getAllUsers({
    page,
    limit = PAGE_SIZE,
    query,
}: {
    query: string;
    page: number;
    limit?: number;
}) {
    const data = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });

    const dataCount = await prisma.user.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
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
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function deleteUser(id: string) {
    try {
        const userExists = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!userExists) throw new Error("User not found");

        await prisma.user.delete({ where: { id } });

        revalidatePath("/admin/users");

        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateUser(user: z.infer<typeof UpdateUserSchema>) {
    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { name: user.name, role: user.role as Role },
        });

        return { success: true, message: "User updated successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
