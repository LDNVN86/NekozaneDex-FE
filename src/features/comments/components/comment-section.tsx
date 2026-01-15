"use client";

import * as React from "react";
import { MessageCircle, Loader2, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { MentionTextarea } from "@/shared/ui/mention-textarea";
import { useCentrifugo } from "@/features/realtime";
import {
  createCommentAction,
  deleteCommentAction,
} from "../actions/comment-actions";
import { CommentItem } from "./comment-item";
import type { Comment } from "../server";

interface CommentSectionProps {
  storyId: string;
  storySlug: string;
  comments: Comment[];
  currentUserId?: string;
  isAdmin?: boolean;
}

export function CommentSection({
  storyId,
  storySlug,
  comments,
  currentUserId,
  isAdmin = false,
}: CommentSectionProps) {
  const [localComments, setLocalComments] = React.useState(comments);
  const [newComment, setNewComment] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  // Track processed comment IDs to prevent duplicates
  const processedIdsRef = React.useRef<Set<string>>(new Set());

  // Realtime subscription - ONLY for syncing comment list across tabs
  // Persistent notifications are handled by backend
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
                      (r, i, arr) => arr.findIndex((x) => x.id === r.id) === i
                    ),
                  }
                : c
            )
          );
        }
      }

      // Handle deleted comments
      if (data.type === "delete_comment" && data.id) {
        processedIdsRef.current.delete(data.id);
        setLocalComments((prev) => prev.filter((c) => c.id !== data.id));
      }
    },
    [currentUserId, localComments]
  );

  useCentrifugo({
    channel: `story:${storyId}`,
    onMessage: handleRealtimeMessage,
    enabled: !!currentUserId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPending) return;

    const content = newComment;
    setNewComment("");

    startTransition(async () => {
      const result = await createCommentAction(storyId, storySlug, content);
      if (!result.success) {
        setNewComment(content);
        toast.error(result.error || "Không thể đăng comment");
      } else {
        if (result.comment) {
          // Mark as processed so realtime won't add again
          processedIdsRef.current.add(result.comment.id);
          setLocalComments((prev) => [result.comment!, ...prev]);
        }
        toast.success("Đã đăng comment");
      }
    });
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId, storySlug);
      if (!result.success) {
        toast.error(result.error || "Không thể xóa comment");
      } else {
        setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Đã xóa comment");
      }
    });
  };

  const handleUpdateComment = (id: string, newComment: Comment) => {
    setLocalComments((prev) => {
      const updated = prev.map((c) => (c.id === id ? newComment : c));
      // Re-sort by is_pinned then created_at
      return [...updated].sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    });
  };

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">
          Bình luận ({localComments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <MentionTextarea
            value={newComment}
            onValueChange={(value) => setNewComment(value)}
            placeholder="Viết bình luận của bạn... (gõ @ để tag người dùng)"
            className="min-h-[100px] mb-3 resize-none"
            maxLength={2000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/2000
            </span>
            <Button type="submit" disabled={isPending || !newComment.trim()}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Đăng bình luận
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-xl p-6 text-center mb-8">
          <p className="text-muted-foreground">
            Vui lòng{" "}
            <a href="/auth/login" className="text-primary hover:underline">
              đăng nhập
            </a>{" "}
            để bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      {localComments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có bình luận nào</p>
          <p className="text-sm">Hãy là người đầu tiên bình luận!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              storySlug={storySlug}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onUpdate={handleUpdateComment}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </section>
  );
}
