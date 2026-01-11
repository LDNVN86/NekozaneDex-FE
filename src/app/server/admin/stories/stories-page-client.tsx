"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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
import { deleteStoryAction } from "@/features/admin/actions";
import type { AdminStory, Genre } from "@/features/admin/interface";

interface StoriesPageClientProps {
  stories: AdminStory[];
  genres: Genre[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export function StoriesPageClient({
  stories,
  genres,
  pagination,
}: StoriesPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteStoryAction(deleteId);
      toast.success("Đã xóa truyện thành công");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa truyện"
      );
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string, isPublished: boolean) => {
    if (!isPublished) {
      return <Badge variant="outline">Nháp</Badge>;
    }
    switch (status) {
      case "completed":
        return <Badge variant="default">Hoàn thành</Badge>;
      case "paused":
        return <Badge variant="secondary">Tạm dừng</Badge>;
      default:
        return <Badge variant="secondary">Đang ra</Badge>;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý truyện</h1>
          <p className="text-muted-foreground">
            Tổng cộng {pagination.total} truyện
          </p>
        </div>
        <Link href="/server/admin/stories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm truyện mới
          </Button>
        </Link>
      </div>

      {/* Stories Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Danh sách truyện</CardTitle>
              <CardDescription>
                Quản lý và chỉnh sửa truyện của bạn
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm truyện..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "Không tìm thấy truyện" : "Chưa có truyện nào"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Tên truyện
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                      Tác giả
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Chapters
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                      Lượt xem
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map((story) => (
                    <tr
                      key={story.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {story.cover_image_url ? (
                            <img
                              src={story.cover_image_url}
                              alt={story.title}
                              className="w-9 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-9 h-12 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                N/A
                              </span>
                            </div>
                          )}
                          <span className="font-medium line-clamp-1">
                            {story.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                        {story.author_name || "Chưa rõ"}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(story.status, story.is_published)}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                        {story.total_chapters}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                        {story.view_count.toLocaleString("vi-VN")}
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
                              <Link href={`/server/admin/stories/${story.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/server/admin/stories/${story.id}/chapters`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Quản lý chapters
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(story.id)}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Trang {pagination.page} / {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    router.push(
                      `/server/admin/stories?page=${pagination.page - 1}`
                    )
                  }
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    router.push(
                      `/server/admin/stories?page=${pagination.page + 1}`
                    )
                  }
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa truyện?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Truyện và tất cả chapters sẽ bị
              xóa vĩnh viễn.
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
