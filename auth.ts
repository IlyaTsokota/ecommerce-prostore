import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, user, trigger, token }: any) {
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;

            if (trigger === "update") {
                session.user.name = user.name;
            }

            return session;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ user, token }: any) {
            if (user) {
                token.role = user.role;

                if (user.name === "NO_NAME") {
                    token.name = user.email.split("@")[0];

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    });
                }
            }

            return token;
        },
        authorized({ request }) {
            if (!request.cookies.get("sessionCartId")) {
                const sessionCartId = crypto.randomUUID();
                const newRequestHeaders = new Headers(request.headers);
                const response = NextResponse.next({ request: { headers: newRequestHeaders } });

                response.cookies.set("sessionCartId", sessionCartId);

                return response;
            } else {
                return true;
            }
        },
    },
});
