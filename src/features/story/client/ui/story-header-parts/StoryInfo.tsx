"use client";

import * as React from "react";
import { User, Palette, Globe } from "lucide-react";
import type { Story } from "@/features/story";

interface StoryInfoProps {
  story: Story;
}

export function StoryInfo({ story }: StoryInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {story.title}
        </h1>
        {story.original_title && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {story.original_title}
          </p>
        )}
        {story.alt_titles && story.alt_titles.length > 0 && (
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Tên khác: {story.alt_titles.join(" | ")}
          </p>
        )}
      </div>

      {/* Credits - Inline */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {story.author_name && (
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-primary/70" />
            {story.author_name}
          </span>
        )}
        {story.artist_name && (
          <span className="flex items-center gap-1">
            <Palette className="h-3.5 w-3.5 text-pink-400/70" />
            Họa sĩ: {story.artist_name}
          </span>
        )}
        {story.translator && (
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-blue-400/70" />
            Dịch: {story.translator}
          </span>
        )}
      </div>
    </div>
  );
}
