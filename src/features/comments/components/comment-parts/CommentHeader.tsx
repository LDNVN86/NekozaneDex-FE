"use client";

import * as React from "react";
import { User, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Comment } from "@/features/comments/server";

interface CommentHeaderProps {
  comment: Comment;
}

export function CommentHeader({ comment }: CommentHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center relative">
        {comment.user?.avatar_url ? (
          <img
            src={comment.user.avatar_url}
            alt={comment.user.username}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-primary" />
        )}
        {comment.is_pinned && (
          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
            <Pin className="h-2.5 w-2.5 fill-current" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">
            {comment.user?.username || "Ẩn danh"}
          </p>
          {comment.is_pinned && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-[10px] font-semibold text-primary uppercase tracking-wider">
              <Pin className="h-2 w-2 fill-current" />
              Đã ghim
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
            locale: vi,
          })}
        </p>
      </div>
    </div>
  );
}
