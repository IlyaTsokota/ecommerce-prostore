import { requireAdmin } from "@/lib/auth-guard";
import { deleteUser, getAllUsers } from "@/lib/features/user/actions/user.actions";
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
import DeleteDialog from "@/components/admin/delete-dialog";
import { formatId } from "@/lib/utils";
import { Role } from "@/lib/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Users",
};

interface AdminUsersPageProps {
    searchParams: Promise<{ page: string; query: string }>;
}

const AdminUsersPage: FC<AdminUsersPageProps> = async ({ searchParams }) => {
    await requireAdmin();

    const { page = "1", query: searchText = "" } = await searchParams;
    const users = await getAllUsers({ query: searchText, page: Number(page) || 0 });

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <h1 className="h2-bold">Users</h1>

                {searchText && (
                    <div>
                        Filtered by <i>&quot;{searchText}&quot;</i>{" "}
                        <Link href="/admin/users">
                            <Button variant="outline" size="sm">
                                Remove Filter
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead>EMAIL</TableHead>
                            <TableHead>ROLE</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{formatId(user.id)}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.role === Role.USER ? (
                                        <Badge variant="secondary">User</Badge>
                                    ) : (
                                        <Badge variant="default">Admin</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/users/${user.id}`}>Edit</Link>
                                    </Button>
                                    <DeleteDialog id={user.id} action={deleteUser} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {users.totalPages > 1 && (
                    <Pagination page={Number(page) || 1} totalPages={users.totalPages} />
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
