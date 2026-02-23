import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z, { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: unknown): T {
    return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split(".");

    return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
    if (error instanceof ZodError) {
        return z.prettifyError(error);
    } else if (error.name === "PrismaClientKnownRequestError") {
        switch (error.code) {
            case "P2002":
                return "Record already exists";

            case "P2025":
                return "Record not found";

            default:
                return "Database error";
        }
    } else if (error.name === "PrismaClientValidationError") {
        return "Invalid database query";
    } else {
        return typeof error.message === "string" ? error.message : JSON.stringify(error.message);
    }
}
