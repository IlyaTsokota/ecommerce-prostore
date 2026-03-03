import z from "zod";
import {
    CreateOrderItemSchema,
    CreateOrderSchema,
    PaymentResultSchema,
} from "../schemas/order.schema";

export type OrderItem = z.infer<typeof CreateOrderItemSchema>;

export type Order = z.infer<typeof CreateOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItems: OrderItem[];
    user: { name: string; email: string };
};

export type PaymentResult = z.infer<typeof PaymentResultSchema>;
