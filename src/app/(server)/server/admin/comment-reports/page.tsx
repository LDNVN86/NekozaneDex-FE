import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getCommentReports } from "@/features/admin/server/reports";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ReportsPageClient } from "./reports-page-client";

export const metadata: Metadata = {
  title: "Quản lý báo cáo | Nekozanedex Admin",
  description: "Danh sách và xử lý báo cáo bình luận",
};

interface ReportsPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function CommentReportsPage({
  searchParams,
}: ReportsPageProps) {
  // Auth check
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  // Get params
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const status = params.status || "pending";

  // Fetch reports
  const result = await getCommentReports({ page, limit: 20, status });

  const reports = result.success ? result.data : { data: [], total: 0 };

  return (
    <ReportsPageClient
      reports={reports.data}
      pagination={{
        page: page,
        total: reports.total,
        totalPages: Math.ceil(reports.total / 20),
      }}
      initialStatus={status}
    />
  );
}
