"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Palette,
  Globe,
  Eye,
  BookOpen,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import {
  formatNumber,
  COUNTRY_LABELS,
  getYearDisplay,
} from "../story-header-utils";
import type { Story, Genre } from "@/features/story";

interface StoryInfoProps {
  story: Story;
}

export function StoryInfo({ story }: StoryInfoProps) {
  const yearDisplay = getYearDisplay(story);

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Title & Alt Titles */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {story.title}
        </h1>
        {story.original_title && (
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {story.original_title}
          </p>
        )}
        {story.alt_titles && story.alt_titles.length > 0 && (
          <p className="text-xs text-muted-foreground/70 mt-1">
            Tên khác: {story.alt_titles.join(" | ")}
          </p>
        )}
      </div>

      {/* Credits Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {story.author_name && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-4 w-4 text-primary/70" />
            <span>{story.author_name}</span>
          </div>
        )}
        {story.artist_name && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Palette className="h-4 w-4 text-pink-400/70" />
            <span>Họa sĩ: {story.artist_name}</span>
          </div>
        )}
        {story.translator && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="h-4 w-4 text-blue-400/70" />
            <span>Dịch: {story.translator}</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{formatNumber(story.view_count)}</span>
          <span className="text-muted-foreground text-xs">lượt đọc</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{story.total_chapters}</span>
          <span className="text-muted-foreground text-xs">chương</span>
        </div>
        {story.rating && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-sm">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="font-medium text-amber-400">
              {story.rating.toFixed(1)}
            </span>
            {story.rating_count && (
              <span className="text-muted-foreground text-xs">
                ({story.rating_count})
              </span>
            )}
          </div>
        )}
        {story.country && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{COUNTRY_LABELS[story.country] || story.country}</span>
          </div>
        )}
        {yearDisplay && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{yearDisplay}</span>
          </div>
        )}
      </div>

      {/* Genres */}
      {story.genres && story.genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {story.genres.map((genre: Genre) => (
            <Link key={genre.id} href={`/client/stories?genre=${genre.slug}`}>
              <Badge
                variant="outline"
                className="hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer"
              >
                {genre.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
