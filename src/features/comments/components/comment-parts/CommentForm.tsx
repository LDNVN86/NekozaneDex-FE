"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { MentionTextarea } from "@/shared/ui/mention-textarea";
import { MediaPicker } from "@/shared/ui/media-picker";

interface CommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function CommentForm({
  newComment,
  setNewComment,
  isPending,
  onSubmit,
}: CommentFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <MentionTextarea
        value={newComment}
        onValueChange={(value) => setNewComment(value)}
        placeholder="Viết bình luận của bạn... (gõ @ để tag người dùng)"
        className="min-h-[100px] mb-3 resize-none"
        maxLength={2000}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {newComment.length}/2000
          </span>
          <MediaPicker
            onEmojiSelect={(emoji) => setNewComment(newComment + emoji)}
          />
        </div>
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
  );
}

export function CommentFormGuest() {
  return (
    <div className="bg-muted/50 rounded-xl p-6 text-center mb-8">
      <p className="text-muted-foreground">
        Vui lòng{" "}
        <a href="/auth/login" className="text-primary hover:underline">
          đăng nhập
        </a>{" "}
        để bình luận
      </p>
    </div>
  );
}
