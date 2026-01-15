"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { MentionTextarea } from "@/shared/ui/mention-textarea";

interface ReplyFormProps {
  showReplyForm: boolean;
  setShowReplyForm: (value: boolean) => void;
  replyContent: string;
  setReplyContent: (value: string) => void;
  isReplying: boolean;
  handleReply: (e: React.FormEvent) => void;
}

export function ReplyForm({
  showReplyForm,
  setShowReplyForm,
  replyContent,
  setReplyContent,
  isReplying,
  handleReply,
}: ReplyFormProps) {
  if (!showReplyForm) return null;

  return (
    <form onSubmit={handleReply} className="mt-3 ml-8">
      <MentionTextarea
        value={replyContent}
        onValueChange={(value) => setReplyContent(value)}
        placeholder="Viết trả lời... (gõ @ để tag)"
        className="min-h-[80px] mb-2 resize-none text-sm"
        maxLength={2000}
      />
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyForm(false)}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isReplying || !replyContent.trim()}
        >
          {isReplying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Trả lời
        </Button>
      </div>
    </form>
  );
}
