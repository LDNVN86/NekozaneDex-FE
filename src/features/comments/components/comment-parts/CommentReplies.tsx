"use client";

import * as React from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Comment } from "../../server";

interface CommentRepliesProps {
  comment: Comment;
  showReplies: boolean;
  setShowReplies: (value: boolean) => void;
  renderReply: (reply: Comment) => React.ReactNode;
}

export function CommentReplies({
  comment,
  showReplies,
  setShowReplies,
  renderReply,
}: CommentRepliesProps) {
  const hasReplies = !!(comment.replies && comment.replies.length > 0);

  if (!hasReplies) return null;

  return (
    <>
      {!showReplies ? (
        <button
          type="button"
          onClick={() => setShowReplies(true)}
          className="flex items-center gap-1.5 mt-2 ml-2 text-xs font-medium text-primary hover:underline"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Xem {comment.replies!.length} phản hồi
          <ChevronDown className="h-3 w-3" />
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setShowReplies(false)}
            className="flex items-center gap-1.5 mt-2 ml-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className="h-3 w-3" />
            Ẩn phản hồi
          </button>
          <div className="mt-3 space-y-3">
            {comment.replies!.map((reply) => renderReply(reply))}
          </div>
        </>
      )}
    </>
  );
}
