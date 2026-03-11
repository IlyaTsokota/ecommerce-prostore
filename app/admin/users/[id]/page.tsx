import { getUserById } from "@/lib/features/user/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";
import UpdateUserForm from "../update-user-form";

export const metadata: Metadata = {
    title: "Update User",
};

interface AdminUserUpdatePageProps {
    params: Promise<{ id: string }>;
}

const AdminUserUpdatePage: FC<AdminUserUpdatePageProps> = async ({ params }) => {
    const { id } = await params;

    const user = await getUserById(id);

    console.log(user);

    if (!user) notFound();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h2 className="h2-bold">Update User</h2>
            <div className="my-8">
                <UpdateUserForm user={user} />
            </div>
        </div>
    );
};

export default AdminUserUpdatePage;
