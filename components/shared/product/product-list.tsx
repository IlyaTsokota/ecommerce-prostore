import { FC } from "react";
import ProductCard from "./product-card";
import { Product } from "@/features/product/product.types";

interface ProductListProps {
    data: Product[];
    title: string;
}

const ProductList: FC<ProductListProps> = ({ data, title }) => {
    return (
        <div className="my-10">
            <h2 className="h2-bold mb-4">{title}</h2>
            {data.length === 0 ? (
                <div>
                    <p>No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {data.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
