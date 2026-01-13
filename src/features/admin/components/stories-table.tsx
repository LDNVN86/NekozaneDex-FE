import { Search, MoreHorizontal, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Badge } from "@/shared/ui/badge";

interface AdminStory {
  id: string;
  title: string;
  coverUrl?: string;
  author: string;
  status: "ongoing" | "completed";
  chapterCount: number;
  viewCount: number;
}

interface StoriesTableProps {
  stories?: AdminStory[];
}

export function StoriesTable({ stories = [] }: StoriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Truyện gần đây</CardTitle>
            <CardDescription>Danh sách truyện mới cập nhật</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm truyện..." className="pl-10" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Chưa có truyện nào</p>
            <p className="text-sm text-muted-foreground mt-1">
              Dữ liệu sẽ được tải khi Admin API hoàn thành
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
                    Số chương
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
                        <img
                          src={story.coverUrl || "/placeholder.svg"}
                          alt={story.title}
                          className="w-9 h-12 object-cover rounded"
                        />
                        <span className="font-medium line-clamp-1">
                          {story.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                      {story.author}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          story.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {story.status === "completed"
                          ? "Hoàn thành"
                          : "Đang ra"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                      {story.chapterCount}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                      {story.viewCount.toLocaleString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
  );
}
