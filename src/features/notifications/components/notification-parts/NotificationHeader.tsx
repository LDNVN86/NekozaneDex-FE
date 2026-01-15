"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { SheetTitle } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";

interface NotificationHeaderProps {
  onMarkAllAsRead: () => void;
  isMarkingAll: boolean;
  unreadCount: number;
}

export function NotificationHeader({
  onMarkAllAsRead,
  isMarkingAll,
  unreadCount,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b pr-12">
      <SheetTitle className="font-semibold text-base">Thông báo</SheetTitle>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground gap-1"
        onClick={onMarkAllAsRead}
        disabled={isMarkingAll || unreadCount === 0}
      >
        {isMarkingAll ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
        Đọc hết
      </Button>
    </div>
  );
}
