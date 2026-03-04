"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, HTMLAttributes } from "react";

type MainNavProps = HTMLAttributes<HTMLElement>;

const links = [
    {
        title: "Overview",
        href: "/admin/overview",
    },
    {
        title: "Products",
        href: "/admin/products",
    },
    {
        title: "Orders",
        href: "/admin/orders",
    },
    {
        title: "Users",
        href: "/admin/users",
    },
];

const MainNav: FC<MainNavProps> = ({ className, ...props }) => {
    const pathname = usePathname();

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {links.map((item) => {
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {
                            "text-muted-foreground": pathname.includes(item.href),
                        })}
                    >
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
};

export default MainNav;
