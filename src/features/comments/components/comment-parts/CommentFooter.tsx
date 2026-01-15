"use client";

import * as React from "react";
import { Heart, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import type { Comment } from "@/features/comments/server";

interface CommentFooterProps {
  comment: Comment;
  currentUserId?: string;
  isEditing: boolean;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  likeCount: number;
  setLikeCount: (value: number) => void;
  isLiking: boolean;
  setIsLiking: (value: boolean) => void;
  showReplies: boolean;
  setShowReplies: (value: boolean) => void;
  hasReplies: boolean;
}

export function CommentFooter({
  comment,
  currentUserId,
  isEditing,
  isLiked,
  setIsLiked,
  likeCount,
  setLikeCount,
  isLiking,
  setIsLiking,
  showReplies,
  setShowReplies,
  hasReplies,
}: CommentFooterProps) {
  if (isEditing) return null;

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/proxy/comments/${comment.id}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.data.liked);
        setLikeCount(data.data.like_count);
      }
    } catch {
      toast.error("Không thể thích");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          className={cn(
            "flex items-center gap-1 text-sm transition-colors",
            isLiked
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-500"
          )}
          onClick={handleLike}
          disabled={!currentUserId || isLiking}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              isLiked && "fill-current",
              isLiking && "animate-pulse"
            )}
          />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
      </div>

      {hasReplies && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {comment.replies!.length} trả lời
        </Button>
      )}
    </>
  );
}
