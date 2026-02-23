import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter })
        .$extends({
            result: {
                product: {
                    price: {
                        compute(product) {
                            return product.price.toString();
                        },
                    },
                    rating: {
                        compute(product) {
                            return product.rating.toString();
                        },
                    },
                },
            },
        })
        .$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
