export const CHAPTER_TYPES = [
  {
    value: "regular",
    label: "Thường",
    color: "bg-slate-500/20 text-slate-400",
  },
  { value: "extra", label: "Extra", color: "bg-purple-500/20 text-purple-400" },
  { value: "bonus", label: "Bonus", color: "bg-pink-500/20 text-pink-400" },
  { value: "omake", label: "Omake", color: "bg-amber-500/20 text-amber-400" },
] as const;

export type ChapterType = (typeof CHAPTER_TYPES)[number]["value"];

/**
 * Extract chapter number from title
 * @param title Example: "Chapter 1 - Test" -> "1"
 */
export const extractChapterNumber = (title: string): string | null => {
  const match = title.match(/chapter\s*(\d+)/i);
  return match ? match[1] : null;
};

export const inputClass =
  "w-full px-4 py-3 bg-input border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all";
