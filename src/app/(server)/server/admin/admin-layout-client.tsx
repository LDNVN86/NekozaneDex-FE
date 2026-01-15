"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/shared/ui/sidebar";
import { Separator } from "@/shared/ui/separator";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const pathname = usePathname();

  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    const segments = pathname
      .replace("/server/admin", "")
      .split("/")
      .filter(Boolean);

    if (segments.length === 0) return "Dashboard";

    const labels: Record<string, string> = {
      stories: "Quản lý truyện",
      chapters: "Quản lý chapters",
      new: "Thêm mới",
      genres: "Thể loại",
      users: "Người dùng",
      settings: "Cài đặt",
      "comment-reports": "Quản lý báo cáo",
    };

    return segments.map((s) => labels[s] || s).join(" / ");
  };

  const handleLogout = () => {
    window.location.href = "/auth/login";
  };

  return (
    <SidebarProvider>
      <AdminSidebar user={user} onLogout={handleLogout} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-sm font-medium">{getBreadcrumb()}</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
