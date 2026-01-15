"use client";

import * as React from "react";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { HtmlContent } from "@/shared/components/html-content";
import { getSourceDisplay } from "../story-header-utils";
import type { Story } from "@/features/story";

interface StorySynopsisProps {
  story: Story;
}

export function StorySynopsis({ story }: StorySynopsisProps) {
  const [synopsisOpen, setSynopsisOpen] = React.useState(true);
  const sourceDisplay = getSourceDisplay(story);

  return (
    <div className="space-y-4">
      <div className="mt-2 rounded-xl bg-muted/30 border border-border/30 overflow-hidden">
        <button
          onClick={() => setSynopsisOpen(!synopsisOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
        >
          <span className="font-semibold text-foreground text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Giới thiệu
          </span>
          {synopsisOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {synopsisOpen && (
          <div className="px-4 pb-4 border-t border-border/20">
            <HtmlContent
              html={story.description || ""}
              fallback="Chưa có mô tả cho truyện này."
              className="text-muted-foreground leading-relaxed text-sm pt-3 prose prose-sm prose-invert max-w-none"
            />
          </div>
        )}
      </div>

      {/* Source Link */}
      {sourceDisplay && story.source_url && (
        <div className="text-sm text-muted-foreground">
          <span>Nguồn: </span>
          <a
            href={story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            {sourceDisplay}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
