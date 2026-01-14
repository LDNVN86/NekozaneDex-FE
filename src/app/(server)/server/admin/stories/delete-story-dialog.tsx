"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { deleteStoryAction } from "@/features/admin/actions";

interface DeleteStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyId: string | null;
}

export function DeleteStoryDialog({
  open,
  onOpenChange,
  storyId,
}: DeleteStoryDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!storyId) return;

    setIsDeleting(true);
    try {
      await deleteStoryAction(storyId);
      toast.success("Đã xóa truyện thành công");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa truyện"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa truyện?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Truyện và tất cả chapters sẽ bị
            xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
