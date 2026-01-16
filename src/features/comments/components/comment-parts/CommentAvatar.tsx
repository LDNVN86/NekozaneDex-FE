import * as React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import type { Comment } from "../../server";

interface CommentAvatarProps {
  comment: Comment;
}

export function CommentAvatar({ comment }: CommentAvatarProps) {
  const userProfileUrl = comment.user?.tag_name
    ? `/client/users/${comment.user.tag_name}`
    : null;

  if (userProfileUrl) {
    return (
      <Link href={userProfileUrl} className="shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-background shadow-sm">
          {comment.user?.avatar_url ? (
            <img
              src={comment.user.avatar_url}
              alt={comment.user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0">
      <User className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
