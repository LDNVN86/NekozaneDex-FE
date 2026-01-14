import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function DashboardStoriesPreview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Truyện gần đây</CardTitle>
            <CardDescription>Danh sách truyện mới cập nhật</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Truy cập trang Quản lý truyện để xem chi tiết
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Dữ liệu sẽ được hiển thị khi truy cập /server/admin/stories
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
