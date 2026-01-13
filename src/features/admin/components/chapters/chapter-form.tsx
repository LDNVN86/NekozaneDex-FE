"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import type { AdminChapter, ChapterFormState } from "../../interface";

interface ChapterFormProps {
  chapter?: AdminChapter;
  action: (
    prevState: ChapterFormState,
    formData: FormData
  ) => Promise<ChapterFormState>;
  onCancel?: () => void;
}

const initialState: ChapterFormState = { success: false };

// Extract chapter number from title
const extractChapterNumber = (title: string): string | null => {
  const match = title.match(/chapter\s*(\d+)/i);
  return match ? match[1] : null;
};

export function ChapterForm({ chapter, action, onCancel }: ChapterFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [title, setTitle] = React.useState(chapter?.title || "");
  const [images, setImages] = React.useState(chapter?.images?.join("\n") || "");

  const chapterNumber = extractChapterNumber(title);
  const imageCount = images
    .split("\n")
    .filter((url) => url.trim().length > 0).length;

  return (
    <form action={formAction} className="max-w-4xl mx-auto">
      {/* Main Card */}
      <Card className="glass-card p-8 fade-in border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {chapter ? "Chỉnh sửa chapter" : "Thêm chapter mới"}
          </h1>
          <p className="text-muted-foreground">
            Nhập thông tin chapter và danh sách URL ảnh
          </p>
        </div>

        {/* Section 1: Chapter Info */}
        <div className="mb-8 pb-8 border-b border-border/30">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Thông tin Chapter
          </h2>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Tiêu đề <span className="text-emerald-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter 1 - Khởi đầu"
                required
                className={`w-full px-4 py-3 bg-input border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  state.fieldErrors?.title ? "border-red-500/50" : ""
                }`}
              />
              {state.fieldErrors?.title && (
                <p className="text-red-500 text-sm mt-2">
                  {state.fieldErrors.title}
                </p>
              )}
            </div>

            {/* Auto-detected chapter number badge */}
            {chapterNumber && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg whitespace-nowrap">
                Ch. {chapterNumber}
              </Badge>
            )}
          </div>
        </div>

        {/* Section 2: Image URLs */}
        <div className="mb-8 pb-8 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                URLs ảnh
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Mỗi dòng là một URL. Thứ tự từ trên xuống = thứ tự trang
              </p>
            </div>
            <div className="text-sm font-semibold text-emerald-400">
              {imageCount} ảnh
            </div>
          </div>

          <textarea
            id="images"
            name="images"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="Nhập mỗi URL ảnh trên một dòng..."
            rows={12}
            className={`w-full px-4 py-3 bg-input border border-border/30 rounded-lg text-foreground placeholder-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
              state.fieldErrors?.images
                ? "border-red-500/50 focus:ring-red-500"
                : "focus:ring-emerald-500"
            }`}
          />
          {state.fieldErrors?.images && (
            <p className="text-red-500 text-sm mt-2">
              {state.fieldErrors.images}
            </p>
          )}
        </div>

        {/* Messages */}
        {state.success && state.message && (
          <Alert className="mb-6 bg-emerald-500/20 border-emerald-500/50">
            <AlertDescription className="text-emerald-100">
              {state.message}
            </AlertDescription>
          </Alert>
        )}

        {!state.success && state.message && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/50">
            <AlertDescription className="text-red-100">
              {state.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-border/30">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="ghost"
              className="flex-1 h-12 text-foreground hover:bg-card/50"
            >
              Hủy
            </Button>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className={`${
              onCancel ? "flex-1" : "w-full"
            } h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : chapter ? (
              "Cập nhật chapter"
            ) : (
              "Tạo chapter"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}
