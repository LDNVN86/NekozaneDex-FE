"use client";

import * as React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { CHAPTER_TYPES } from "../chapter-form-utils";
import type { ChapterFormState } from "../../../interface";

interface FormPreviewSidebarProps {
  chapterLabel: string;
  detectedChapterNumber: string | null;
  chapterType: string;
  imageCount: number;
  ordering: string;
  state: ChapterFormState;
  isPending: boolean;
  isEdit: boolean;
  onCancel?: () => void;
}

export function FormPreviewSidebar({
  chapterLabel,
  detectedChapterNumber,
  chapterType,
  imageCount,
  ordering,
  state,
  isPending,
  isEdit,
  onCancel,
}: FormPreviewSidebarProps) {
  const currentType = CHAPTER_TYPES.find((t) => t.value === chapterType);

  return (
    <Card className="glass-card p-5 border-border/50 bg-card/50 backdrop-blur-sm sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-foreground">Preview</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-muted-foreground text-xs mb-1">Hiển thị:</p>
          <p className="font-medium text-foreground">
            {chapterLabel ||
              (detectedChapterNumber
                ? `Chương ${detectedChapterNumber}`
                : "Chương ?")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Loại:</span>
          <Badge className={currentType?.color}>{currentType?.label}</Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Số trang:</span>
          <span className="font-medium text-foreground">{imageCount}</span>
        </div>

        {ordering && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Thứ tự:</span>
            <span className="font-medium text-foreground">{ordering}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      {state.success && state.message && (
        <Alert className="mt-4 bg-emerald-500/20 border-emerald-500/50">
          <AlertDescription className="text-emerald-300 text-sm">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      {!state.success && state.message && (
        <Alert className="mt-4 bg-red-500/20 border-red-500/50">
          <AlertDescription className="text-red-300 text-sm">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="mt-6 space-y-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : isEdit ? (
            "Cập nhật chapter"
          ) : (
            "Tạo chapter"
          )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Hủy
          </Button>
        )}
      </div>
    </Card>
  );
}
