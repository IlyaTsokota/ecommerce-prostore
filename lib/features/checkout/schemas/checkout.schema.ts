import { PAYMENT_METHODS } from "@/lib/constants";
import z from "zod";

export const PaymentMethodSchema = z
    .object({
        type: z.string().min(1, "Payment method is required"),
    })
    .refine((data) => PAYMENT_METHODS.includes(data.type), {
        path: ["type"],
        error: "Invalid payment method",
    });
