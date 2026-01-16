"use client";

import * as React from "react";
import Link from "next/link";
import { User, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Comment } from "@/features/comments/server";

interface CommentHeaderProps {
  comment: Comment;
}

export function CommentHeader({ comment }: CommentHeaderProps) {
  const userProfileUrl = comment.user?.tag_name
    ? `/client/users/${comment.user.tag_name}`
    : null;

  const AvatarContent = (
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
  );

  const UsernameContent = (
    <p className="font-medium text-sm hover:text-primary hover:underline transition-colors">
      {comment.user?.username || "Ẩn danh"}
    </p>
  );

  return (
    <div className="flex items-center gap-3">
      {userProfileUrl ? (
        <Link href={userProfileUrl} className="shrink-0">
          {AvatarContent}
        </Link>
      ) : (
        AvatarContent
      )}
      <div>
        <div className="flex items-center gap-2">
          {userProfileUrl ? (
            <Link href={userProfileUrl}>{UsernameContent}</Link>
          ) : (
            UsernameContent
          )}
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
