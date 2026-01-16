"use client";

import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Notification } from "@/features/notifications/server";
import { markNotificationAsReadAction } from "@/features/notifications/actions/notification-actions";

interface NotificationHistoryTabProps {
  notifications: Notification[];
}

export function NotificationHistoryTab({
  notifications: initialNotifications,
}: NotificationHistoryTabProps) {
  const [notifications, setNotifications] =
    React.useState(initialNotifications);

  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: {
      today: Notification[];
      yesterday: Notification[];
      older: Notification[];
    } = { today: [], yesterday: [], older: [] };

    notifications.forEach((notif) => {
      const date = new Date(notif.created_at);
      if (date.toDateString() === today.toDateString()) {
        groups.today.push(notif);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(notif);
      } else {
        groups.older.push(notif);
      }
    });

    return groups;
  }, [notifications]);

  const handleMarkAsRead = async (notif: Notification) => {
    if (notif.is_read) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
    );

    await markNotificationAsReadAction(notif.id);
  };

  const handleClick = (notif: Notification) => {
    handleMarkAsRead(notif);
    if (notif.link) {
      window.location.href = notif.link;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "new_chapter":
        return "📚";
      case "reply":
        return "💬";
      case "mention":
        return "📢";
      default:
        return "🔔";
    }
  };

  const renderGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {items.map((notif) => (
            <button
              key={notif.id}
              type="button"
              onClick={() => handleClick(notif)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all",
                "hover:bg-muted/50 hover:border-primary/20",
                notif.is_read
                  ? "bg-card/50 border-border/30"
                  : "bg-primary/5 border-primary/20",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{getIcon(notif.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-medium text-sm",
                        !notif.is_read && "text-primary",
                      )}
                    >
                      {notif.title}
                    </p>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  {notif.message && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notif.created_at), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground/50 mx-auto mb-4">
          <Bell className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-muted-foreground">Chưa có thông báo nào</p>
        <p className="text-sm text-muted-foreground mt-1">
          Thông báo mới sẽ xuất hiện ở đây
        </p>
      </div>
    );
  }

  return (
    <div>
      {renderGroup("Hôm nay", groupedNotifications.today)}
      {renderGroup("Hôm qua", groupedNotifications.yesterday)}
      {renderGroup("Trước đó", groupedNotifications.older)}
    </div>
  );
}
