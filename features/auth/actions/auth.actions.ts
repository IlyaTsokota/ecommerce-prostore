"use server";

import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/features/auth/schemas/auth.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = await signInSchema.parseAsync({
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
