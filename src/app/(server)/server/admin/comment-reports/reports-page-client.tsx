"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flag,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  User,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { CommentReport } from "@/features/admin/server/reports";
import {
  resolveCommentReportAction,
  adminDeleteReportedCommentAction,
} from "@/features/admin/actions/report-actions";

interface ReportsPageClientProps {
  reports: CommentReport[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  initialStatus: string;
}

export function ReportsPageClient({
  reports,
  pagination,
  initialStatus,
}: ReportsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedReport, setSelectedReport] =
    React.useState<CommentReport | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState<string | null>(null);

  const handleStatusTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1");
    router.push(`/server/admin/comment-reports?${params.toString()}`);
  };

  const handleResolve = async (
    reportId: string,
    status: "resolved" | "dismissed"
  ) => {
    setIsPending(reportId);
    const result = await resolveCommentReportAction(reportId, status);
    setIsPending(null);

    if (result.success) {
      toast.success(
        status === "resolved"
          ? "Đã đánh dấu đã giải quyết"
          : "Đã bác bỏ báo cáo"
      );
      setIsDetailOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Không thể xử lý báo cáo");
    }
  };

  const handleDeleteComment = async (reportId: string, commentId: string) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
      )
    )
      return;

    setIsPending(reportId);
    const result = await adminDeleteReportedCommentAction(reportId, commentId);
    setIsPending(null);

    if (result.success) {
      toast.success("Đã xóa bình luận và giải quyết báo cáo");
      setIsDetailOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Không thể xóa bình luận");
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
            Chờ xử lý
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">
            Đã giải quyết
          </Badge>
        );
      case "dismissed":
        return (
          <Badge className="bg-muted text-muted-foreground">Đã bác bỏ</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-500/20">
          <Flag className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Quản lý báo cáo</h1>
          <p className="text-sm text-muted-foreground">
            Tổng cộng {pagination.total} báo cáo
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Danh sách báo cáo</CardTitle>
              <CardDescription>
                Xử lý các báo cáo vi phạm từ người dùng
              </CardDescription>
            </div>
            <Tabs value={initialStatus} onValueChange={handleStatusTabChange}>
              <TabsList>
                <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
                <TabsTrigger value="resolved">Đã giải quyết</TabsTrigger>
                <TabsTrigger value="dismissed">Bác bỏ</TabsTrigger>
                <TabsTrigger value="">Tất cả</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Người báo cáo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Nội dung báo cáo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Thời gian
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground"
                    >
                      Không có báo cáo nào
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {report.user?.username || "Ẩn danh"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-[300px]">
                        <p className="truncate text-sm">{report.reason}</p>
                      </td>
                      <td className="py-3 px-4">
                        {statusBadge(report.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(report.created_at), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Chi tiết báo cáo
            </DialogTitle>
            <DialogDescription>
              Xem nội dung bình luận và ra quyết định xử lý
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 py-4">
              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">
                    Người báo cáo
                  </p>
                  <p>{selectedReport.user?.username}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">
                    Thời gian
                  </p>
                  <p>
                    {new Date(selectedReport.created_at).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Lý do báo cáo
                </p>
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 italic text-sm">
                  "{selectedReport.reason}"
                </div>
              </div>

              {/* Reported Comment Content */}
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Nội dung bình luận bị báo cáo
                </p>
                <div className="p-4 rounded-lg bg-muted/50 border relative">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      {selectedReport.comment?.user?.username}
                    </span>
                  </div>
                  <p className="text-sm">
                    {selectedReport.comment?.content || (
                      <span className="text-muted-foreground italic">
                        Nội dung không khả dụng (có thể đã bị xóa)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {selectedReport.status === "pending" && (
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                      handleDeleteComment(
                        selectedReport.id,
                        selectedReport.comment_id
                      )
                    }
                    disabled={
                      isPending === selectedReport.id || !selectedReport.comment
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa bình luận & Xác nhận
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleResolve(selectedReport.id, "resolved")}
                    disabled={isPending === selectedReport.id}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đánh dấu giải quyết
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      handleResolve(selectedReport.id, "dismissed")
                    }
                    disabled={isPending === selectedReport.id}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Bác bỏ
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
