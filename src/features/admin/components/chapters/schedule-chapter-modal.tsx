"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { scheduleChapterAction } from "@/features/admin/actions";

interface ScheduleChapterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  storyId: string;
  chapterTitle: string;
  currentScheduledAt?: string;
  onSuccess: () => void;
}

export function ScheduleChapterModal({
  open,
  onOpenChange,
  chapterId,
  storyId,
  chapterTitle,
  currentScheduledAt,
  onSuccess,
}: ScheduleChapterModalProps) {
  const [scheduledAt, setScheduledAt] = React.useState<Date | undefined>(
    undefined
  );
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setScheduledAt(
        currentScheduledAt ? new Date(currentScheduledAt) : undefined
      );
    } else {
      setScheduledAt(undefined);
    }
  }, [open, currentScheduledAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledAt) {
      toast.error("Vui lòng chọn thời gian xuất bản");
      return;
    }

    if (scheduledAt <= new Date()) {
      toast.error("Thời gian hẹn giờ phải sau thời điểm hiện tại");
      return;
    }

    setIsPending(true);
    try {
      await scheduleChapterAction(
        chapterId,
        storyId,
        scheduledAt.toISOString()
      );
      toast.success("Đã hẹn giờ xuất bản thành công");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể hẹn giờ xuất bản"
      );
    } finally {
      setIsPending(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Hẹn giờ xuất bản
          </DialogTitle>
          <DialogDescription>
            Chọn thời gian xuất bản cho chapter: <strong>{chapterTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DateTime Picker */}
          <div className="space-y-2">
            <Label>Thời gian xuất bản</Label>
            <DateTimePicker
              value={scheduledAt}
              onChange={setScheduledAt}
              minDate={today}
              placeholder="Chọn ngày và giờ xuất bản"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Múi giờ: Việt Nam (GMT+7)
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending || !scheduledAt}>
              {isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
