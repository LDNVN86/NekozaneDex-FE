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
  // Render content with highlighted @mentions and GIF images
  const renderContentWithMentions = (content: string) => {
    // First, split by GIF markdown pattern
    const gifRegex = /!\[gif\]\((https?:\/\/[^\)]+)\)/gi;
    const mentionRegex = /(@[a-z0-9_]+)/gi;

    // Split by GIF pattern first
    const parts = content.split(gifRegex);
    const gifMatches = content.match(gifRegex) || [];

    const result: React.ReactNode[] = [];

    parts.forEach((part, partIndex) => {
      // Render text part with mentions
      if (part) {
        const textParts = part.split(mentionRegex);
        textParts.forEach((textPart, textIndex) => {
          if (textPart.match(/^@[a-z0-9_]+$/i)) {
            result.push(
              <span
                key={`mention-${partIndex}-${textIndex}`}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                {textPart}
              </span>,
            );
          } else if (textPart) {
            result.push(textPart);
          }
        });
      }

      // Add GIF image if there's a match for this position
      if (partIndex < gifMatches.length) {
        const gifUrl = gifMatches[partIndex].match(
          /!\[gif\]\((https?:\/\/[^\)]+)\)/i,
        )?.[1];
        if (gifUrl) {
          result.push(
            <img
              key={`gif-${partIndex}`}
              src={gifUrl}
              alt="GIF"
              className="max-w-[300px] max-h-[200px] rounded-lg mt-2 mb-1"
              loading="lazy"
            />,
          );
        }
      }
    });

    return result;
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
