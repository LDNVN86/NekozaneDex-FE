import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const result = await getAuthFromCookie();

  if (!result.success) {
    redirect("/auth/login");
  }

  const user = result.data;

  if (!hasRole(user, ["admin"])) {
    redirect("/");
  }

  return (
    <div>
      <h1>Admin Page Dashboard</h1>
      <p>Xin Chào, {user.username}</p>
    </div>
  );
}
