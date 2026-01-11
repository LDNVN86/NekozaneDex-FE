import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { redirect } from "next/navigation";
import AdminDashboard from "./admin-dashboard";

export const metadata = {
  title: "Admin Dashboard | Nekozanedex",
  description: "Quản trị hệ thống Nekozanedex",
};

export default async function AdminPage() {
  const result = await getAuthFromCookie();

  if (!result.success) {
    redirect("/auth/login");
  }

  const user = result.data;

  if (!hasRole(user, ["admin"])) {
    redirect("/");
  }

  return <AdminDashboard user={user} />;
}
