import { redirect } from "next/navigation";
import { Role } from "./generated/prisma/enums";
import { auth } from "@/auth";

export async function requireAdmin() {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
        redirect("/unauthorized");
    }

    return session;
}
