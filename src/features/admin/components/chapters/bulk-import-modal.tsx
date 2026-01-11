"use client";

import * as React from "react";
import { Upload, FileJson, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { bulkImportChaptersAction } from "@/features/admin/actions";

interface BulkChapterData {
  title: string;
  images: string[];
}

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyId: string;
  storyTitle: string;
  onSuccess: () => void;
}

const EXAMPLE_JSON = `[
  {
    "title": "Chapter 1 - Khởi đầu",
    "images": [
      "https://example.com/ch1/page1.jpg",
      "https://example.com/ch1/page2.jpg"
    ]
  },
  {
    "title": "Chapter 2 - Gặp gỡ",
    "images": [
      "https://example.com/ch2/page1.jpg"
    ]
  }
]`;

export function BulkImportModal({
  open,
  onOpenChange,
  storyId,
  storyTitle,
  onSuccess,
}: BulkImportModalProps) {
  const [jsonInput, setJsonInput] = React.useState("");
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [parsedChapters, setParsedChapters] = React.useState<BulkChapterData[]>(
    []
  );
  const [isPending, setIsPending] = React.useState(false);

  const validateAndParse = (input: string) => {
    setJsonInput(input);
    setParseError(null);
    setParsedChapters([]);

    if (!input.trim()) {
      return;
    }

    try {
      const data = JSON.parse(input);

      if (!Array.isArray(data)) {
        setParseError("Dữ liệu phải là một mảng JSON");
        return;
      }

      if (data.length === 0) {
        setParseError("Mảng không được rỗng");
        return;
      }

      for (let i = 0; i < data.length; i++) {
        const chapter = data[i];
        if (!chapter.title || typeof chapter.title !== "string") {
          setParseError(`Chapter ${i + 1}: Thiếu hoặc sai định dạng title`);
          return;
        }
        if (!Array.isArray(chapter.images) || chapter.images.length === 0) {
          setParseError(`Chapter ${i + 1}: Thiếu hoặc sai định dạng images`);
          return;
        }
      }

      setParsedChapters(data);
    } catch {
      setParseError("JSON không hợp lệ. Vui lòng kiểm tra cú pháp.");
    }
  };

  const handleSubmit = async () => {
    if (parsedChapters.length === 0) {
      toast.error("Vui lòng nhập dữ liệu hợp lệ");
      return;
    }

    setIsPending(true);
    try {
      await bulkImportChaptersAction(storyId, parsedChapters);
      toast.success(`Đã import ${parsedChapters.length} chapters thành công`);
      onOpenChange(false);
      setJsonInput("");
      setParsedChapters([]);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể import chapters"
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleLoadExample = () => {
    validateAndParse(EXAMPLE_JSON);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Bulk Import Chapters
          </DialogTitle>
          <DialogDescription>
            Import nhiều chapters cùng lúc cho: <strong>{storyTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* JSON Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="json-input">Dữ liệu JSON</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLoadExample}
                className="text-xs"
              >
                <FileJson className="h-3 w-3 mr-1" />
                Xem ví dụ
              </Button>
            </div>
            <Textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => validateAndParse(e.target.value)}
              placeholder={EXAMPLE_JSON}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          {/* Error */}
          {parseError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {parsedChapters.length > 0 && (
            <Alert>
              <AlertDescription className="text-green-600">
                ✓ Đã parse {parsedChapters.length} chapters hợp lệ
              </AlertDescription>
            </Alert>
          )}

          {parsedChapters.length > 0 && (
            <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {parsedChapters.map((ch, idx) => (
                  <li key={idx}>
                    • {ch.title} ({ch.images.length} ảnh)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || parsedChapters.length === 0}
          >
            {isPending
              ? "Đang import..."
              : `Import ${parsedChapters.length} chapters`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
