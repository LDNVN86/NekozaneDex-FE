import Link from "next/link";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { AdminStory } from "@/features/admin/interface";

interface StoriesTableProps {
  stories: AdminStory[];
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

function getStatusBadge(status: string, isPublished: boolean) {
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
}

export function StoriesTable({
  stories,
  onDelete,
  emptyMessage = "Chưa có truyện nào",
}: StoriesTableProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
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
          {stories.map((story) => (
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
                      <span className="text-xs text-muted-foreground">N/A</span>
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
                      <Link href={`/server/admin/stories/${story.id}/chapters`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Quản lý chapters
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(story.id)}
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
  );
}
