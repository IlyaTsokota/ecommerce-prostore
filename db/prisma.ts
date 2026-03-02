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
                cart: {
                    itemsPrice: {
                        needs: { itemsPrice: true },
                        compute(cart) {
                            return cart.itemsPrice.toString();
                        },
                    },
                    taxPrice: {
                        needs: { taxPrice: true },
                        compute(cart) {
                            return cart.taxPrice.toString();
                        },
                    },
                    shippingPrice: {
                        needs: { shippingPrice: true },
                        compute(cart) {
                            return cart.shippingPrice.toString();
                        },
                    },
                    totalPrice: {
                        needs: { totalPrice: true },
                        compute(cart) {
                            return cart.totalPrice.toString();
                        },
                    },
                },
                order: {
                    itemsPrice: {
                        needs: { itemsPrice: true },
                        compute(order) {
                            return order.itemsPrice.toString();
                        },
                    },
                    taxPrice: {
                        needs: { taxPrice: true },
                        compute(order) {
                            return order.taxPrice.toString();
                        },
                    },
                    shippingPrice: {
                        needs: { shippingPrice: true },
                        compute(order) {
                            return order.shippingPrice.toString();
                        },
                    },
                    totalPrice: {
                        needs: { totalPrice: true },
                        compute(order) {
                            return order.totalPrice.toString();
                        },
                    },
                },
                orderItem: {
                    price: {
                        compute(orderItem) {
                            return orderItem.price.toString();
                        },
                    },
                },
            },
        })
        .$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
