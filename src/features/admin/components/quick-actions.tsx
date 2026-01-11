import Link from "next/link";
import { Plus, FileText, Users, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface ActionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const actions: ActionItem[] = [
  {
    title: "Thêm truyện",
    description: "Tạo truyện mới",
    icon: Plus,
    href: "/server/admin/stories/new",
    color: "text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20",
  },
  {
    title: "Thêm chương",
    description: "Đăng chapter mới",
    icon: FileText,
    href: "/server/admin/stories",
    color: "text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/20",
  },
  {
    title: "Quản lý user",
    description: "Danh sách người dùng",
    icon: Users,
    href: "/server/admin",
    color: "text-violet-500 bg-violet-500/10 group-hover:bg-violet-500/20",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hành động nhanh</CardTitle>
        <CardDescription>Các tác vụ thường dùng</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={cn(
              "group flex items-center gap-4 p-3 rounded-lg",
              "border border-transparent",
              "transition-all duration-200",
              "hover:bg-muted/50 hover:border-border"
            )}
          >
            <div
              className={cn(
                "rounded-lg p-2.5 transition-colors duration-200",
                action.color
              )}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
            <div className="text-muted-foreground group-hover:text-foreground transition-colors">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
