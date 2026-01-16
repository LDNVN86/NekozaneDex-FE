import * as React from "react";
import Link from "next/link";
import { Pin } from "lucide-react";
import type { Comment } from "../../server";

interface CommentBubbleHeaderProps {
  comment: Comment;
  userProfileUrl: string | null;
}

export function CommentBubbleHeader({
  comment,
  userProfileUrl,
}: CommentBubbleHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-0.5">
      {userProfileUrl ? (
        <Link href={userProfileUrl}>
          <span className="font-semibold text-sm hover:underline">
            {comment.user?.username || "Ẩn danh"}
          </span>
        </Link>
      ) : (
        <span className="font-semibold text-sm">
          {comment.user?.username || "Ẩn danh"}
        </span>
      )}
      {comment.is_pinned && (
        <span className="flex items-center gap-0.5 text-[10px] text-primary font-medium">
          <Pin className="h-2.5 w-2.5 fill-current" />
          Ghim
        </span>
      )}
    </div>
  );
}
