"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Plus, Pencil } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import type { Genre } from "../../interface";
import type { GenreFormState } from "../../actions/genre-actions";

interface GenreFormProps {
  genre?: Genre;
  action: (
    prevState: GenreFormState,
    formData: FormData
  ) => Promise<GenreFormState>;
  onCancel?: () => void;
}

const initialState: GenreFormState = { success: false };

export function GenreForm({ genre, action, onCancel }: GenreFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (state.success && onCancel) {
      onCancel();
    }
  }, [state.success, onCancel]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="genre-name"
          className="block text-sm font-medium text-foreground"
        >
          Tên thể loại <span className="text-emerald-400">*</span>
        </label>
        <Input
          ref={inputRef}
          id="genre-name"
          name="name"
          type="text"
          defaultValue={genre?.name}
          placeholder="Ví dụ: Hành động, Romance..."
          required
          maxLength={50}
          className="bg-input/50 border-border/30 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500"
        />
        {state.fieldErrors?.name && (
          <p className="text-destructive text-xs">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="genre-description"
          className="block text-sm font-medium text-foreground"
        >
          Mô tả{" "}
          <span className="text-muted-foreground text-xs">
            (không bắt buộc)
          </span>
        </label>
        <Textarea
          id="genre-description"
          name="description"
          defaultValue={genre?.description ?? ""}
          placeholder="Mô tả ngắn gọn về thể loại này..."
          maxLength={500}
          rows={3}
          className="bg-input/50 border-border/30 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 resize-none"
        />
        {state.fieldErrors?.description && (
          <p className="text-destructive text-xs">
            {state.fieldErrors.description}
          </p>
        )}
        <p className="text-muted-foreground text-xs">Tối đa 500 ký tự</p>
      </div>

      {!state.success && state.message && (
        <Alert className="bg-destructive/10 border-destructive/30">
          <AlertDescription className="text-destructive text-sm">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1"
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : genre ? (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Cập nhật
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Tạo mới
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
