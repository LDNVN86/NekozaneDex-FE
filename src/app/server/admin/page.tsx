import AdminDashboard from "./admin-dashboard";
import { requireUser } from "@/features/auth/server/auth";

export default async function AdminPage() {
  await requireUser({
    roles: ["admin"],
    redirectTo: "/auth/login?next=/server/admin",
    forbiddenRedirect: "/",
  });

  return <AdminDashboard />;
}
