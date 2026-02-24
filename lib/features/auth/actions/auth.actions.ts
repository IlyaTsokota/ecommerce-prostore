"use server";

import { signIn, signOut } from "@/auth";
import prisma from "@/db/prisma";
import { SignInFormSchema, SignUpFormSchema } from "@/lib/features/auth/schemas/auth.schema";
import { formatError } from "@/lib/utils";
import { hash } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = await SignInFormSchema.parseAsync({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        await signIn("credentials", user);

        return { success: true, message: "Signed in successfully" };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: "Invalid email or password" };
    }
}

export async function signOutUser() {
    await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = await SignUpFormSchema.parseAsync({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        });

        const plainPassword = user.password;
        user.password = await hash(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        });

        await signIn("credentials", {
            email: user.email,
            password: plainPassword,
        });

        return { success: true, message: "User registered successfully" };
    } catch (error) {
        // console.log(error.name);
        // console.log(error.code);
        // console.log(error.errors);
        // console.log(error.meta?.driverAdapterError?.cause?.constraint?.fields);

        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: formatError(error) };
    }
}
