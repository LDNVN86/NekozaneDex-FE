"use client";

import * as React from "react";
import { FileText, Tag, Hash, Layers } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { CHAPTER_TYPES, inputClass } from "../chapter-form-utils";
import type { ChapterFieldErrors } from "../../../interface";

interface InfoSectionProps {
  title: string;
  setTitle: (value: string) => void;
  chapterLabel: string;
  setChapterLabel: (value: string) => void;
  chapterType: string;
  setChapterType: (value: string) => void;
  ordering: string;
  setOrdering: (value: string) => void;
  detectedChapterNumber: string | null;
  fieldErrors?: ChapterFieldErrors;
}

export function InfoSection({
  title,
  setTitle,
  chapterLabel,
  setChapterLabel,
  chapterType,
  setChapterType,
  ordering,
  setOrdering,
  detectedChapterNumber,
  fieldErrors,
}: InfoSectionProps) {
  return (
    <Card className="glass-card p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-violet-500/20">
          <FileText className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Thông tin Chapter
          </h2>
          <p className="text-sm text-muted-foreground">Nhập thông tin cơ bản</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            Tiêu đề <span className="text-violet-400">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter 1 - Khởi đầu"
              required
              className={`${inputClass} ${
                fieldErrors?.title ? "border-red-500/50" : ""
              }`}
            />
            {detectedChapterNumber && (
              <Badge className="bg-violet-500/20 text-violet-400 border border-violet-500/30 px-3 py-2 whitespace-nowrap">
                Ch. {detectedChapterNumber}
              </Badge>
            )}
          </div>
          {fieldErrors?.title && (
            <p className="text-red-500 text-sm mt-2">{fieldErrors.title}</p>
          )}
        </div>

        {/* Grid: Label + Ordering */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="chapter_label"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              <Tag className="inline h-3.5 w-3.5 mr-1" />
              Label tùy chỉnh
            </label>
            <input
              id="chapter_label"
              name="chapter_label"
              type="text"
              value={chapterLabel}
              onChange={(e) => setChapterLabel(e.target.value)}
              placeholder="1.5, Extra 1..."
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Để trống = dùng số chapter
            </p>
          </div>
          <div>
            <label
              htmlFor="ordering"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              <Hash className="inline h-3.5 w-3.5 mr-1" />
              Thứ tự hiển thị
            </label>
            <input
              id="ordering"
              name="ordering"
              type="number"
              step="0.1"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              placeholder="1.0, 1.5, 2.0..."
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Dùng để sắp xếp chapter
            </p>
          </div>
        </div>

        {/* Chapter Type */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <Layers className="inline h-3.5 w-3.5 mr-1" />
            Loại chapter
          </label>
          <div className="flex flex-wrap gap-2">
            {CHAPTER_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setChapterType(type.value)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  chapterType === type.value
                    ? `${type.color} border-current`
                    : "bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="chapter_type" value={chapterType} />
        </div>
      </div>
    </Card>
  );
}
