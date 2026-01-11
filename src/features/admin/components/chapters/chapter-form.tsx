"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { AdminChapter, ChapterFormState } from "../../interface";

interface ChapterFormProps {
  chapter?: AdminChapter;
  action: (
    prevState: ChapterFormState,
    formData: FormData
  ) => Promise<ChapterFormState>;
}

const initialState: ChapterFormState = { success: false };

export function ChapterForm({ chapter, action }: ChapterFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const defaultImages = chapter?.images?.join("\n") || "";

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>
            {chapter ? "Chỉnh sửa chapter" : "Thêm chapter mới"}
          </CardTitle>
          <CardDescription>
            Nhập thông tin chapter và danh sách URL ảnh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề chapter <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={chapter?.title || state.values?.title}
              placeholder="Ví dụ: Chapter 1 - Khởi đầu"
              required
            />
            {state.fieldErrors?.title && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.title}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label htmlFor="images">
              URL ảnh <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="images"
              name="images"
              defaultValue={defaultImages || state.values?.images?.join("\n")}
              placeholder="Nhập mỗi URL ảnh trên một dòng..."
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Mỗi dòng là một URL ảnh. Thứ tự từ trên xuống dưới sẽ là thứ tự
              các trang trong chapter.
            </p>
            {state.fieldErrors?.images && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.images}
              </p>
            )}
          </div>

          {/* Error/Success message */}
          {state.message && (
            <p
              className={`text-sm ${
                state.success ? "text-green-600" : "text-destructive"
              }`}
            >
              {state.message}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Đang xử lý..."
              : chapter
              ? "Cập nhật chapter"
              : "Tạo chapter"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
