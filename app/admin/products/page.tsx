import { requireAdmin } from "@/lib/auth-guard";
import { deleteProduct, getAllProducts } from "@/lib/features/product/actions/product.actions";
import { Metadata } from "next";
import { FC } from "react";
import Pagination from "@/components/shared/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency, formatId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/admin/delete-dialog";

export const metadata: Metadata = {
    title: "Admin Products",
};

interface AdminProductsPageProps {
    searchParams: Promise<{ page: string; query: string; category: string }>;
}

const AdminProductsPage: FC<AdminProductsPageProps> = async ({ searchParams }) => {
    await requireAdmin();

    const { page = "1", query: searchText = "", category = "" } = await searchParams;
    const products = await getAllProducts({ query: searchText, page: Number(page) || 0, category });

    return (
        <div className="space-y-2">
            <div className="flex-between">
                <h2 className="h2-bold">Products</h2>
                <Button asChild>
                    <Link href="/admin/products/create">Create Product</Link>
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead className="text-right">PRICE</TableHead>
                            <TableHead>CATEGORY</TableHead>
                            <TableHead>STOCK</TableHead>
                            <TableHead>RATING</TableHead>
                            <TableHead className="w-25">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{formatId(product.id)}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(product.price)}
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.rating}</TableCell>

                                <TableCell className="flex gap-1">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                    </Button>
                                    <DeleteDialog id={product.id} action={deleteProduct} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {products.totalPages > 1 && (
                    <Pagination page={Number(page) || 1} totalPages={products?.totalPages} />
                )}
            </div>
        </div>
    );
};

export default AdminProductsPage;
