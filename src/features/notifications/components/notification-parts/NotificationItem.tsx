"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import type { Notification } from "@/features/notifications/server";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-4 cursor-pointer transition-colors hover:bg-muted/50",
        !notification.is_read && "bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 w-full">
        {!notification.is_read && (
          <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-primary" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground pl-4">
        {formatDistanceToNow(new Date(notification.created_at), {
          addSuffix: true,
          locale: vi,
        })}
      </span>
    </div>
  );
}
