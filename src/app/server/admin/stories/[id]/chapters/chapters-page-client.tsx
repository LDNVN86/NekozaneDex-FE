"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { ScheduleChapterModal, BulkImportModal } from "@/features/admin";
import {
  deleteChapterAction,
  publishChapterAction,
} from "@/features/admin/actions";
import type { AdminStory, AdminChapter } from "@/features/admin/interface";

interface ChaptersPageClientProps {
  story: AdminStory;
  chapters?: AdminChapter[];
}

export function ChaptersPageClient({
  story,
  chapters = [],
}: ChaptersPageClientProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Modal states
  const [scheduleModal, setScheduleModal] = React.useState<{
    open: boolean;
    chapterId: string;
    chapterTitle: string;
    scheduledAt?: string;
  }>({ open: false, chapterId: "", chapterTitle: "", scheduledAt: undefined });

  const [bulkImportOpen, setBulkImportOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteChapterAction(deleteId, story.id);
      toast.success("Đã xóa chapter thành công");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa chapter"
      );
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handlePublish = async (chapterId: string) => {
    try {
      await publishChapterAction(chapterId, story.id);
      toast.success("Đã xuất bản chapter");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xuất bản chapter"
      );
    }
  };

  const openScheduleModal = (chapter: AdminChapter) => {
    setScheduleModal({
      open: true,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      scheduledAt: chapter.scheduled_at,
    });
  };

  const getStatusBadge = (chapter: AdminChapter) => {
    if (chapter.is_published) {
      return <Badge variant="default">Đã xuất bản</Badge>;
    }
    if (chapter.scheduled_at) {
      const scheduledDate = new Date(chapter.scheduled_at);
      return (
        <Badge variant="secondary" className="gap-1">
          <Calendar className="h-3 w-3" />
          {scheduledDate.toLocaleDateString("vi-VN")}
        </Badge>
      );
    }
    return <Badge variant="outline">Nháp</Badge>;
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/server/admin/stories/${story.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Quản lý chapters</h1>
          <p className="text-muted-foreground">{story.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Link href={`/server/admin/stories/${story.id}/chapters/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm chapter
            </Button>
          </Link>
        </div>
      </div>

      {/* Chapters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chapters</CardTitle>
          <CardDescription>
            Tổng cộng {story.total_chapters} chapters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chapters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có chapter nào</p>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setBulkImportOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
                <Link href={`/server/admin/stories/${story.id}/chapters/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm chapter đầu tiên
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Số
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Tiêu đề
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                      Số trang
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Lượt xem
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => (
                    <tr
                      key={chapter.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">
                        {chapter.chapter_number}
                      </td>
                      <td className="py-3 px-4">
                        <span className="line-clamp-1">{chapter.title}</span>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                        {chapter.page_count}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(chapter)}</td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        {chapter.view_count.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/server/admin/stories/${story.id}/chapters/${chapter.id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            {!chapter.is_published && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handlePublish(chapter.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xuất bản ngay
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openScheduleModal(chapter)}
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Hẹn giờ xuất bản
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(chapter.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      <ScheduleChapterModal
        open={scheduleModal.open}
        onOpenChange={(open) => setScheduleModal((prev) => ({ ...prev, open }))}
        chapterId={scheduleModal.chapterId}
        storyId={story.id}
        chapterTitle={scheduleModal.chapterTitle}
        currentScheduledAt={scheduleModal.scheduledAt}
        onSuccess={() => router.refresh()}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        storyId={story.id}
        storyTitle={story.title}
        onSuccess={() => router.refresh()}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chapter sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
