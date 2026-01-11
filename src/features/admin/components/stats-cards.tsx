import {
  BookOpen,
  FileText,
  Users,
  Eye,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StatItem {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
}

const statsData: StatItem[] = [
  {
    title: "Tổng truyện",
    value: "1,234",
    change: "+12%",
    changeType: "increase",
    icon: BookOpen,
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Tổng chương",
    value: "45,678",
    change: "+8%",
    changeType: "increase",
    icon: FileText,
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Người dùng",
    value: "12,345",
    change: "+24%",
    changeType: "increase",
    icon: Users,
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    title: "Lượt xem hôm nay",
    value: "89,012",
    change: "+15%",
    changeType: "increase",
    icon: Eye,
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <div
          key={stat.title}
          className={cn(
            "group relative overflow-hidden rounded-xl border bg-card p-6",
            "transition-all duration-300 ease-out",
            "hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
            "dark:hover:shadow-black/20"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50",
              stat.gradient
            )}
          />

          {/* Content */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <div
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  stat.changeType === "increase"
                    ? "text-emerald-500"
                    : "text-red-500"
                )}
              >
                <TrendingUp
                  className={cn(
                    "h-3 w-3",
                    stat.changeType === "decrease" && "rotate-180"
                  )}
                />
                <span>{stat.change}</span>
                <span className="text-muted-foreground font-normal">
                  vs tháng trước
                </span>
              </div>
            </div>

            {/* Icon */}
            <div
              className={cn(
                "rounded-xl p-3 transition-transform duration-300",
                "group-hover:scale-110",
                stat.iconBg
              )}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </div>

          {/* Decorative element */}
          <div
            className={cn(
              "absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-10",
              "transition-transform duration-500 group-hover:scale-150",
              stat.iconBg.replace("/10", "/50")
            )}
          />
        </div>
      ))}
    </div>
  );
}
