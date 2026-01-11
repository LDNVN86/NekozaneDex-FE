import type { Metadata } from "next";
import { getAuthFromCookie } from "@/features/auth/server";
import { AdminLayoutClient } from "./admin-layout-client";

export const metadata: Metadata = {
  title: "Admin Panel | Nekozanedex",
  description: "Quản lý nội dung Nekozanedex",
};

export default async function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await getAuthFromCookie();
  const user = authResult.success ? authResult.data : null;

  return (
    <AdminLayoutClient
      user={
        user
          ? {
              name: user.username,
              email: user.email,
            }
          : undefined
      }
    >
      {children}
    </AdminLayoutClient>
  );
}
