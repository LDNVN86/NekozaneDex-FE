"use client";

import * as React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { HtmlContent } from "@/shared/components/html-content";
import { getSourceDisplay } from "../story-header-utils";
import { cn } from "@/shared/lib/utils";
import type { Story } from "@/features/story";

interface StorySynopsisProps {
  story: Story;
}

export function StorySynopsis({ story }: StorySynopsisProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const sourceDisplay = getSourceDisplay(story);

  return (
    <div className="space-y-2">
      {/* Synopsis with truncate + expand */}
      <div className="rounded-lg bg-muted/30 border border-border/30 overflow-hidden">
        <div className="px-3 py-2 border-b border-border/20">
          <span className="font-medium text-sm">Giới thiệu</span>
        </div>

        <div className="relative">
          <div
            className={cn(
              "px-3 py-2 overflow-hidden transition-all duration-300",
              isExpanded ? "max-h-[200px] overflow-y-auto" : "max-h-[80px]",
            )}
          >
            <HtmlContent
              html={story.description || ""}
              fallback="Chưa có mô tả."
              className="text-muted-foreground text-sm leading-relaxed"
            />
          </div>

          {/* Fade overlay when collapsed */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-primary hover:bg-muted/20 transition-colors border-t border-border/20"
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Source Link */}
      {sourceDisplay && story.source_url && (
        <p className="text-xs text-muted-foreground">
          Nguồn:{" "}
          <a
            href={story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary hover:underline"
          >
            {sourceDisplay}
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </p>
      )}
    </div>
  );
}
