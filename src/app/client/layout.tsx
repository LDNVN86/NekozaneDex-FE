import { Header } from "@/shared/components/header";
import { getAuthFromCookie } from "@/features/auth/server";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await getAuthFromCookie();
  const user = authResult.success ? authResult.data : null;

  return (
    <>
      <Header user={user} />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
