import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Users",
};

const AdminUsersPage = async () => {
    await requireAdmin();

    return <></>;
};

export default AdminUsersPage;
