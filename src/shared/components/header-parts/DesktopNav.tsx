"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Thể loại", href: "/client/genres" },
  { name: "Xếp hạng", href: "/client/rankings" },
  { name: "Tìm kiếm", href: "/client/stories" },
];

interface DesktopNavProps {
  pathname: string;
}

export function DesktopNav({ pathname }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
            pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
