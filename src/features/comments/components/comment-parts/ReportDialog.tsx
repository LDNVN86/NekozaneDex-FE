"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

interface ReportDialogProps {
  isReporting: boolean;
  setIsReporting: (value: boolean) => void;
  reportReason: string;
  setReportReason: (value: string) => void;
  isSubmittingReport: boolean;
  handleReport: () => void;
}

export function ReportDialog({
  isReporting,
  setIsReporting,
  reportReason,
  setReportReason,
  isSubmittingReport,
  handleReport,
}: ReportDialogProps) {
  return (
    <Dialog open={isReporting} onOpenChange={setIsReporting}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Báo cáo bình luận</DialogTitle>
          <DialogDescription>
            Vui lòng cho biết lý do bạn báo cáo bình luận này. Báo cáo của bạn
            sẽ được quản trị viên xem xét.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do báo cáo</Label>
            <Textarea
              id="reason"
              placeholder="Ví dụ: ngôn từ không phù hợp, spam, tiết lộ nội dung truyện..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {reportReason.length}/500
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsReporting(false)}
            disabled={isSubmittingReport}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleReport}
            disabled={isSubmittingReport || !reportReason.trim()}
          >
            {isSubmittingReport && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Gửi báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
