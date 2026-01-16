"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Heart, MoreHorizontal, Pin, Pencil, Trash2, Flag } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { Comment } from "../../server";

interface CommentActionBarProps {
  comment: Comment;
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  currentUserId?: string;
  isOwner: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  isReply?: boolean;
  showReplyForm: boolean;
  onLike: () => void;
  onReplyToggle: () => void;
  onEdit: () => void;
  onPin: () => void;
  onReport: () => void;
  onDelete: () => void;
}

export function CommentActionBar({
  comment,
  likeCount,
  isLiked,
  isLiking,
  currentUserId,
  isOwner,
  canEdit,
  canDelete,
  canPin,
  isReply,
  showReplyForm,
  onLike,
  onReplyToggle,
  onEdit,
  onPin,
  onReport,
  onDelete,
}: CommentActionBarProps) {
  return (
    <div className="flex items-center gap-4 mt-1 ml-2 text-xs">
      {/* Like */}
      <button
        type="button"
        onClick={onLike}
        disabled={!currentUserId || isLiking}
        className={cn(
          "font-medium hover:underline transition-colors",
          isLiked
            ? "text-red-500"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {isLiked ? "Đã thích" : "Thích"}
      </button>

      {/* Reply */}
      {!isReply && currentUserId && (
        <button
          type="button"
          onClick={onReplyToggle}
          className="font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          Trả lời
        </button>
      )}

      {/* Time */}
      <span className="text-muted-foreground">
        {formatDistanceToNow(new Date(comment.created_at), {
          addSuffix: false,
          locale: vi,
        })}
      </span>

      {/* Like count */}
      {likeCount > 0 && (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          {likeCount}
        </span>
      )}

      {/* More actions dropdown */}
      {(canEdit || canDelete || canPin || currentUserId) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {canEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {canPin && (
              <DropdownMenuItem onClick={onPin}>
                <Pin className="h-4 w-4 mr-2" />
                {comment.is_pinned ? "Bỏ ghim" : "Ghim"}
              </DropdownMenuItem>
            )}
            {currentUserId && !isOwner && (
              <DropdownMenuItem onClick={onReport}>
                <Flag className="h-4 w-4 mr-2" />
                Báo cáo
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
