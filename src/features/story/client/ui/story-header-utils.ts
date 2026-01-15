"use client";

import type { Story, Chapter } from "@/features/story";

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ongoing: {
    label: "Đang ra",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  paused: {
    label: "Tạm ngưng",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
};

export const COUNTRY_LABELS: Record<string, string> = {
  JP: "Nhật Bản",
  CN: "Trung Quốc",
  KR: "Hàn Quốc",
  VN: "Việt Nam",
  US: "Mỹ",
};

export const formatNumber = (num: number) => num.toLocaleString("vi-VN");

/**
 * Get oldest and newest chapter numbers from chapters array
 */
export function getChapterNumbers(
  chapters: Chapter[],
  newestChapterNumber?: number
) {
  if (!chapters || chapters.length === 0) {
    return {
      oldestChapterNumber: 1,
      newestChapterNum: newestChapterNumber || 1,
    };
  }
  const sorted = [...chapters].sort((a, b) => {
    const orderA = a.ordering ?? a.chapter_number;
    const orderB = b.ordering ?? b.chapter_number;
    return orderA - orderB;
  });
  return {
    oldestChapterNumber: sorted[0].chapter_number,
    newestChapterNum: sorted[sorted.length - 1].chapter_number,
  };
}

/**
 * Get publication year display string
 */
export function getYearDisplay(story: Story) {
  if (!story.release_year) return null;
  if (story.end_year) return `${story.release_year} - ${story.end_year}`;
  if (story.status === "completed") return `${story.release_year}`;
  return `${story.release_year} - Hiện tại`;
}

/**
 * Get source display string
 */
export function getSourceDisplay(story: Story) {
  if (story.source_name) return story.source_name;
  if (story.source_url) {
    try {
      const url = new URL(story.source_url);
      return url.hostname.replace("www.", "");
    } catch {
      return "Nguồn";
    }
  }
  return null;
}
