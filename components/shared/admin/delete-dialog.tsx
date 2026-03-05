"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";

interface DeleteDialogProps {
    id: string;
    action: (id: string) => Promise<{ success: boolean; message: string }>;
}

const DeleteDialog: FC<DeleteDialogProps> = ({ action, id }) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDeleteClick = () => {
        startTransition(async () => {
            const response = await action(id);

            if (!response.success) {
                toast.error(response.message);
            } else {
                setOpen(false);
                toast.success(response.message);
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="cursor-pointer">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="cursor-pointer"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={handleDeleteClick}
                    >
                        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;
