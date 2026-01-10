import { Plus, FileText, Users } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hành động nhanh</CardTitle>
        <CardDescription>Các tác vụ thường dùng</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Thêm truyện
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Thêm chương
        </Button>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Quản lý user
        </Button>
      </CardContent>
    </Card>
  );
}
