import {
  BookOpen,
  FileText,
  Users,
  Eye,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

const statsData: StatItem[] = [
  {
    title: "Tổng truyện",
    value: "1,234",
    change: "+12%",
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    title: "Tổng chương",
    value: "45,678",
    change: "+8%",
    icon: FileText,
    color: "text-green-500",
  },
  {
    title: "Người dùng",
    value: "12,345",
    change: "+24%",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Lượt xem hôm nay",
    value: "89,012",
    change: "+15%",
    icon: Eye,
    color: "text-orange-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} so với tháng trước
                </p>
              </div>
              <div className={cn("p-3 rounded-lg bg-muted", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
