import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt-ts-edge";

export const { signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/sing-in",
        error: "/sign-in",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    },
                });

                if (user?.password) {
                    const isMatch = await compare(credentials.password as string, user.password);

                    if (isMatch) {
                        return { id: user.id, name: user.name, email: user.email, role: user.role };
                    }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, user, trigger, token }) {
            if (token?.sub) {
                session.user.id = token.sub;
            }

            if (trigger === "update") {
                session.user.name = user.name;
            }

            return session;
        },
    },
});
