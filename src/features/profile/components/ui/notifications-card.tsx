"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";

interface NotificationSettings {
  newChapters: boolean;
  weeklyUpdates: boolean;
}

export function NotificationsCard() {
  const [settings, setSettings] = React.useState<NotificationSettings>({
    newChapters: true,
    weeklyUpdates: false,
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    // TODO: Persist to backend when API is ready
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Thông báo</CardTitle>
        <CardDescription>Quản lý tùy chọn thông báo của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotificationToggle
          label="Thông báo chương mới"
          description="Nhận thông báo khi có chương mới được phát hành"
          checked={settings.newChapters}
          onCheckedChange={(checked) => updateSetting("newChapters", checked)}
        />
        <NotificationToggle
          label="Email cập nhật hàng tuần"
          description="Nhận bản tóm tắt hàng tuần về truyện yêu thích của bạn"
          checked={settings.weeklyUpdates}
          onCheckedChange={(checked) => updateSetting("weeklyUpdates", checked)}
        />
      </CardContent>
    </Card>
  );
}

function NotificationToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex-1">
        <Label className="font-medium cursor-pointer">{label}</Label>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
