"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

interface PaginationProps {
    page: number;
    totalPages: number;
    urlParamName?: string;
}

const Pagination: FC<PaginationProps> = ({ page, totalPages, urlParamName = "page" }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleClick = (val: number) => {
        const pageValue = page + val;

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: urlParamName,
            value: pageValue.toString(),
        });

        router.push(newUrl);
    };

    return (
        <div className="flex gap-2">
            <Button
                size="lg"
                className="w-28"
                variant="outline"
                disabled={page <= 1}
                onClick={() => handleClick(-1)}
            >
                Previous
            </Button>
            <Button
                size="lg"
                className="w-28"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => handleClick(1)}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
