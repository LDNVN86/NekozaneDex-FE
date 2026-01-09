"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Eye,
  TrendingUp,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { mockStories } from "@/features/story/data/mock-data";
import { cn } from "@/shared/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "Truyện", active: false },
  { icon: FileText, label: "Chương", active: false },
  { icon: Users, label: "Người dùng", active: false },
];

const statsCards = [
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

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("dashboard");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-card transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="font-semibold">Admin Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label.toLowerCase())}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeSection === item.label.toLowerCase()
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Tổng quan hệ thống Nekozanedex
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm truyện mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

          <Card>
            <CardHeader>
              <CardTitle>Thống kê truy cập</CardTitle>
              <CardDescription>7 ngày gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-2">
                {[65, 45, 78, 90, 55, 88, 72].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stories Table */}
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
                  {mockStories.map((story) => (
                    <tr
                      key={story.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              story.coverUrl ||
                              `/placeholder.svg?height=48&width=36&query=${story.title}`
                            }
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
                            story.status === "completed"
                              ? "default"
                              : "secondary"
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
