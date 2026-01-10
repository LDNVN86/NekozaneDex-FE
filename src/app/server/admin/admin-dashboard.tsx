"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  AdminSidebar,
  StatsCards,
  QuickActions,
  StoriesTable,
} from "@/features/admin";
import { BarChart } from "@/shared/components/charts";

const TRAFFIC_DATA = [65, 45, 78, 90, 55, 88, 72];
const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = React.useState("dashboard");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

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
      </main>
    </div>
  );
}
