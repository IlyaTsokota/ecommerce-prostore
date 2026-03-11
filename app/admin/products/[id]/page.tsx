import { getProductById } from "@/lib/features/product/actions/product.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";
import ProductForm from "../product-form";

export const metadata: Metadata = {
    title: "Update Product",
};

interface AdminProductUpdatePageProps {
    params: Promise<{ id: string }>;
}

const AdminProductUpdatePage: FC<AdminProductUpdatePageProps> = async ({ params }) => {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) notFound();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h2 className="h2-bold">Update Product</h2>
            <div className="my-8">
                <ProductForm type="Update" product={product} />
            </div>
        </div>
    );
};

export default AdminProductUpdatePage;
