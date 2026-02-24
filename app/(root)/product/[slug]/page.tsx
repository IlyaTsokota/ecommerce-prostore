import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/features/cart/actions/cart.actions";
import { getProductBySlug } from "@/lib/features/product/actions/product.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";

interface ProductDetailsPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return {
        title: product?.name ?? "Product not found",
    };
}

const ProductDetailsPage: FC<ProductDetailsPageProps> = async ({ params }) => {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const cart = await getMyCart();

    return (
        <>
            <section>
                <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="col-span-2">
                        <ProductImages images={product.images} />
                    </div>
                    <div className="col-span-2 p-5">
                        <div className="flex flex-col gap-6">
                            <p>
                                {product.brand} {product.category}
                            </p>
                            <h1 className="h3-bold">{product.name}</h1>
                            <p>
                                {product.rating} of {product.numReviews} Reviews
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 ">
                                <ProductPrice
                                    value={Number(product.price)}
                                    className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                                />
                            </div>

                            <div className="mt-10">
                                <p className="font-semibold">Description</p>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Card>
                            <CardContent className="px-4">
                                <div className="mb-2 flex justify-between">
                                    <div>Price</div>
                                    <div>
                                        <ProductPrice value={Number(product.price)} />
                                    </div>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <div>Status</div>
                                    {product.stock > 0 ? (
                                        <Badge variant="outline">In Stock</Badge>
                                    ) : (
                                        <Badge variant="destructive">Out Of Stock</Badge>
                                    )}
                                </div>
                                {product.stock > 0 && (
                                    <div className="flex-center">
                                        <AddToCart
                                            cart={cart}
                                            item={{
                                                name: product.name,
                                                price: product.price,
                                                image: product.images[0],
                                                productId: product.id,
                                                qty: 1,
                                                slug: product.slug,
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetailsPage;
