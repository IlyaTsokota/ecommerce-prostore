"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

    useEffect(() => {
        setQueryValue(searchParams.get("query") || "");
    }, [searchParams]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        if (queryValue.trim()) {
            params.set("query", queryValue.trim());
        } else {
            params.delete("query");
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit}>
            <Input
                type="search"
                placeholder="Search..."
                name="query"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                className="md:w-25 lg:w-75"
            />
            <button className="sr-only" type="submit">
                Search
            </button>
        </form>
    );
};

export default AdminSearch;
