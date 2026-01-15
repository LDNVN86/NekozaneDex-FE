"use client";

import * as React from "react";
import {
  Reply,
  Trash2,
  Loader2,
  Pencil,
  AtSign,
  Pin,
  PinOff,
  Flag,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Comment } from "@/features/comments/server";

interface CommentActionsProps {
  comment: Comment;
  currentUserId?: string;
  isAdmin?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  isEditing: boolean;
  isPending: boolean;
  isPinning: boolean;
  handlePin: () => void;
  handleEdit: () => void;
  onDelete: (id: string) => void;
  setIsReporting: (value: boolean) => void;
  setShowReplyForm: (value: boolean) => void;
  showReplyForm: boolean;
  setReplyContent: (value: string) => void;
}

export function CommentActions({
  comment,
  currentUserId,
  isAdmin,
  canEdit,
  canDelete,
  canPin,
  isEditing,
  isPending,
  isPinning,
  handlePin,
  handleEdit,
  onDelete,
  setIsReporting,
  setShowReplyForm,
  showReplyForm,
  setReplyContent,
}: CommentActionsProps) {
  if (isEditing) return null;

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Pin button for Admin */}
      {canPin && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2",
            comment.is_pinned
              ? "text-primary hover:text-primary"
              : "text-muted-foreground"
          )}
          title={comment.is_pinned ? "Bỏ ghim" : "Ghim bình luận"}
          onClick={handlePin}
          disabled={isPinning}
        >
          {isPinning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : comment.is_pinned ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Quick Tag button */}
      {currentUserId && comment.user?.tag_name && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          title={`Tag @${comment.user.tag_name}`}
          onClick={() => {
            setReplyContent(`@${comment.user.tag_name} `);
            setShowReplyForm(true);
          }}
        >
          <AtSign className="h-4 w-4" />
        </Button>
      )}

      {currentUserId && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <Reply className="h-4 w-4" />
        </Button>
      )}

      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-destructive hover:text-destructive"
          onClick={() => onDelete(comment.id)}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {/* Report button for other users */}
      {currentUserId && currentUserId !== comment.user_id && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-warning"
          title="Báo cáo"
          onClick={() => setIsReporting(true)}
        >
          <Flag className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
