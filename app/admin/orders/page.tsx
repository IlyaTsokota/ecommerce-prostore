import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Orders",
};

const AdminOrdersPage = async () => {
    await requireAdmin();

    return <></>;
};

export default AdminOrdersPage;
