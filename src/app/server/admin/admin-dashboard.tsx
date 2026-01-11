"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { StatsCards, QuickActions, StoriesTable } from "@/features/admin";
import { BarChart } from "@/shared/components/charts";

const TRAFFIC_DATA = [65, 45, 78, 90, 55, 88, 72];
const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface AdminDashboardProps {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Xin chào, <span className="font-medium">{user.username}</span> 👋
          </p>
        </div>
        <Link href="/server/admin/stories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm truyện mới
          </Button>
        </Link>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <QuickActions />
        <BarChart
          title="Thống kê truy cập"
          description="7 ngày gần nhất"
          data={TRAFFIC_DATA}
          labels={WEEK_DAYS}
        />
      </div>

      <StoriesTable />
    </>
  );
}
