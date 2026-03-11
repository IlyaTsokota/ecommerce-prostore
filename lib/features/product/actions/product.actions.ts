"use server";

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../../../constants";
import prisma from "@/db/prisma";
import {
    CreateProductInput,
    Product,
    UpdateProductInput,
} from "@/lib/features/product/types/product.types";
import { convertToPlainObject, formatError } from "../../../utils";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/product.schema";

export async function getLatestProducts(): Promise<Product[]> {
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: LATEST_PRODUCTS_LIMIT,
    });

    return convertToPlainObject(data);
}

export const getProductBySlug = cache(async (slug: string): Promise<Product> => {
    const data = await prisma.product.findUnique({
        where: {
            slug,
        },
    });

    return convertToPlainObject(data);
});

export const getProductById = cache(async (id: string): Promise<Product> => {
    const data = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    return convertToPlainObject(data);
});

export async function getAllProducts({
    query,
    page,
    limit = PAGE_SIZE,
    category,
}: {
    query: string;
    page: number;
    limit?: number;
    category?: string;
}): Promise<{ data: Product[]; totalPages: number }> {
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count();

    return {
        data: convertToPlainObject(data),
        totalPages: Math.ceil(dataCount / limit),
    };
}

export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!productExists) throw new Error("Product not found");

        await prisma.product.delete({ where: { id } });

        revalidatePath("/admin/products");

        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function createProduct(data: CreateProductInput) {
    try {
        const product = await CreateProductSchema.parseAsync(data);

        await prisma.product.create({ data: product });

        revalidatePath("/admin/products");

        return { success: true, message: "Product created successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateProduct(data: UpdateProductInput) {
    try {
        const product = await UpdateProductSchema.parseAsync(data);

        const productExists = await prisma.product.findFirst({
            where: {
                id: product.id,
            },
        });

        if (!productExists) throw new Error("Product not found");

        await prisma.product.update({ where: { id: product.id }, data: product });

        revalidatePath("/admin/products");

        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
