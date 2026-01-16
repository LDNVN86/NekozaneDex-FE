"use client";

import * as React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { ScrollArea } from "@/shared/ui/scroll-area";
import type { Notification } from "../server";
import { useNotificationLogic } from "../hooks/use-notification-logic";

// Sub-components
import { NotificationItem } from "./notification-parts/NotificationItem";
import { NotificationHeader } from "./notification-parts/NotificationHeader";

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  currentUserId?: string;
}

export function NotificationBell({
  notifications,
  unreadCount: initialUnreadCount,
  currentUserId,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    unreadCount,
    localNotifications,
    isMarkingAll,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotificationLogic({
    notifications,
    initialUnreadCount,
    currentUserId,
  });

  const onNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification);
    if (notification.link) {
      setIsOpen(false);
      window.location.href = notification.link;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Thông báo</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="w-full max-w-none h-auto max-h-[70vh] rounded-b-2xl p-0"
      >
        <NotificationHeader
          onMarkAllAsRead={handleMarkAllAsRead}
          isMarkingAll={isMarkingAll}
          unreadCount={unreadCount}
        />

        {localNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Bell className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground">
              Chưa có thông báo nào
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh]">
            <div className="divide-y">
              {localNotifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => onNotificationClick(notification)}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {localNotifications.length > 0 && (
          <div className="border-t p-3">
            <Link
              href="/client/profile?tab=notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-primary hover:underline"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
