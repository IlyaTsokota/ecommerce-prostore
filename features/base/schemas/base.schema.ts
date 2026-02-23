import { formatNumberWithDecimal } from "@/lib/utils";
import z from "zod";

export const CurrencySchema = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        "Price must have exactly two decimal places",
    );

export const PasswordSchema = z.string().min(6, "Password must be at least than 6 characters");
