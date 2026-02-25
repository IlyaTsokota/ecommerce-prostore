import prisma from "@/db/prisma";

export async function getUserById(id: string) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) throw new Error("User not found");

    return user;
}
