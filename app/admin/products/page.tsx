import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Products",
};

const AdminProductsPage = async () => {
    await requireAdmin();

    return <></>;
};

export default AdminProductsPage;
