"use client";

import * as React from "react";
import { useCentrifugo } from "@/features/realtime";
import type { Comment } from "../server";

interface UseRealtimeCommentsOptions {
  storyId: string;
  currentUserId?: string;
  setLocalComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export function useRealtimeComments({
  storyId,
  currentUserId,
  setLocalComments,
}: UseRealtimeCommentsOptions) {
  // Track processed comment IDs to prevent duplicates
  const processedIdsRef = React.useRef<Set<string>>(new Set());

  const handleRealtimeMessage = React.useCallback(
    (data: { type: string; comment?: Comment; id?: string }) => {
      // Handle new top-level comments
      if (data.type === "new_comment" && data.comment) {
        const commentId = data.comment.id;
        const isFromSelf = data.comment.user_id === currentUserId;

        // Skip if already processed OR if it's our own comment (we added it optimistically)
        if (processedIdsRef.current.has(commentId) || isFromSelf) {
          processedIdsRef.current.add(commentId);
          return;
        }
        processedIdsRef.current.add(commentId);

        // Silently add to list - NO TOAST (would be annoying while reading)
        setLocalComments((prev) => {
          if (prev.some((c) => c.id === commentId)) return prev;
          return [data.comment!, ...prev];
        });
      }

      // Handle replies
      if (data.type === "reply_comment" && data.comment) {
        const reply = data.comment;
        const parentId = reply.parent_id;

        // Skip if already processed
        if (processedIdsRef.current.has(reply.id)) {
          return;
        }
        processedIdsRef.current.add(reply.id);

        // Add reply to parent comment's replies array
        if (parentId) {
          setLocalComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? {
                    ...c,
                    replies: [...(c.replies || []), reply].filter(
                      (r, i, arr) => arr.findIndex((x) => x.id === r.id) === i,
                    ),
                  }
                : c,
            ),
          );
        }
      }

      // Handle deleted comments
      if (data.type === "delete_comment" && data.id) {
        processedIdsRef.current.delete(data.id);
        setLocalComments((prev) => prev.filter((c) => c.id !== data.id));
      }
    },
    [currentUserId, setLocalComments],
  );

  useCentrifugo({
    channel: `story:${storyId}`,
    onMessage: handleRealtimeMessage,
    enabled: !!currentUserId,
  });

  // Return ref so parent can mark IDs as processed
  return { processedIdsRef };
}
