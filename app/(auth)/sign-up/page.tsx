import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC } from "react";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
    title: "Sign Up",
};

interface SignUpPageProps {
    searchParams: Promise<{ callbackUrl: string }>;
}

const SignUpPage: FC<SignUpPageProps> = async ({ searchParams }) => {
    const { callbackUrl } = await searchParams;
    const session = await auth();

    if (session) {
        return redirect(callbackUrl || "/");
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-4">
                    <Link href="/" className="flex-center">
                        <Image
                            src="/images/logo.svg"
                            width={100}
                            height={100}
                            alt={`${APP_NAME} logo`}
                            priority
                        />
                    </Link>
                    <CardTitle className="text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Enter you information below to sign-up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;
