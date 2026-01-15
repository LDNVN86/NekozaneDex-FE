"use client";

import * as React from "react";
import { toast } from "sonner";
import { useCentrifugo } from "@/features/realtime/hooks/use-centrifugo";
import {
  markNotificationAsReadAction,
  markAllNotificationsReadAction,
} from "../actions/notification-actions";
import type { Notification } from "@/features/notifications/server";

interface UseNotificationLogicProps {
  notifications: Notification[];
  initialUnreadCount: number;
  currentUserId?: string;
}

export function useNotificationLogic({
  notifications,
  initialUnreadCount,
  currentUserId,
}: UseNotificationLogicProps) {
  const [unreadCount, setUnreadCount] = React.useState(initialUnreadCount);
  const [localNotifications, setLocalNotifications] =
    React.useState(notifications);
  const [isMarkingAll, setIsMarkingAll] = React.useState(false);

  // Track processed notification IDs to prevent duplicates (especially in StrictMode)
  const processedIdsRef = React.useRef<Set<string>>(new Set());

  // Play notification sound
  const playSound = React.useCallback(() => {
    try {
      const audio = new Audio("/kuru-kuru-kururing.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  // Realtime subscription for new notifications
  const handleRealtimeMessage = React.useCallback(
    (data: { type: string; notification?: Notification }) => {
      if (data.type === "new_notification" && data.notification) {
        const newNotif = data.notification;

        // Skip if already processed
        if (processedIdsRef.current.has(newNotif.id)) return;
        processedIdsRef.current.add(newNotif.id);

        setLocalNotifications((prev) => {
          if (prev.some((n) => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });

        setUnreadCount((prevCount) => prevCount + 1);
        playSound();
        toast.info(newNotif.title, {
          description: newNotif.message,
        });
      }
    },
    [playSound]
  );

  useCentrifugo({
    channel: currentUserId ? `user:${currentUserId}` : "",
    onMessage: handleRealtimeMessage,
    enabled: !!currentUserId,
  });

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.is_read) return;

    // Optimistic update
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    const result = await markNotificationAsReadAction(notification.id);
    if (!result.success) {
      // Rollback
      setLocalNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: false } : n
        )
      );
      setUnreadCount((prev) => prev + 1);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (isMarkingAll || unreadCount === 0) return;

    setIsMarkingAll(true);
    const previousNotifications = [...localNotifications];
    const previousCount = unreadCount;

    // Optimistic update
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    const result = await markAllNotificationsReadAction();
    if (!result.success) {
      // Rollback
      setLocalNotifications(previousNotifications);
      setUnreadCount(previousCount);
      toast.error("Không thể đánh dấu tất cả đã đọc");
    }
    setIsMarkingAll(false);
  };

  return {
    unreadCount,
    localNotifications,
    isMarkingAll,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}
