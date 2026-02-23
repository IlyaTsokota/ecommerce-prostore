import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/features/product/actions/product.actions";

const Homepage = async () => {
    const latestProducts = await getLatestProducts();

    return (
        <>
            <ProductList data={latestProducts} title="New Arrivals" />
        </>
    );
};

export default Homepage;
