"use client";

import * as React from "react";
import { Loader2, X, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { MentionTextarea } from "@/shared/ui/mention-textarea";
import type { Comment } from "@/features/comments/server";

interface CommentContentProps {
  comment: Comment;
  isEditing: boolean;
  editContent: string;
  setEditContent: (value: string) => void;
  isUpdating: boolean;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
}

export function CommentContent({
  comment,
  isEditing,
  editContent,
  setEditContent,
  isUpdating,
  handleCancelEdit,
  handleSaveEdit,
}: CommentContentProps) {
  // Render content with highlighted @mentions
  const renderContentWithMentions = (content: string) => {
    const mentionRegex = /(@[a-z0-9]+)/gi;
    const parts = content.split(mentionRegex);
    return parts.map((part, index) => {
      if (part.match(/^@[a-z0-9]+$/i)) {
        return (
          <span
            key={index}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <MentionTextarea
          value={editContent}
          onValueChange={(value) => setEditContent(value)}
          className="min-h-[80px] resize-none text-sm"
          maxLength={2000}
          disabled={isUpdating}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {editContent.length}/2000
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isUpdating || !editContent.trim()}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Lưu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm whitespace-pre-wrap">
      {renderContentWithMentions(comment.content)}
    </p>
  );
}
