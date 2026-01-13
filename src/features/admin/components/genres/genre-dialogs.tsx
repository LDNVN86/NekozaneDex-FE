"use client";

import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
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
import type { Genre } from "../../interface";
import {
  createGenreAction,
  updateGenreAction,
} from "../../actions/genre-actions";
import { GenreForm } from "./genre-form";

interface CreateGenreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGenreDialog({
  open,
  onOpenChange,
}: CreateGenreDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
            Thêm thể loại mới
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/70">
            Tạo thể loại mới để phân loại truyện
          </DialogDescription>
        </DialogHeader>
        <GenreForm
          action={createGenreAction}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditGenreDialogProps {
  genre: Genre | null;
  onClose: () => void;
}

export function EditGenreDialog({ genre, onClose }: EditGenreDialogProps) {
  return (
    <Dialog open={!!genre} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
              <Pencil className="w-5 h-5 text-amber-400" />
            </div>
            Chỉnh sửa thể loại
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/70">
            Cập nhật thông tin cho "{genre?.name}"
          </DialogDescription>
        </DialogHeader>
        {genre && (
          <GenreForm
            genre={genre}
            action={updateGenreAction.bind(null, genre.id)}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DeleteGenreDialogProps {
  genre: Genre | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteGenreDialog({
  genre,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteGenreDialogProps) {
  return (
    <AlertDialog open={!!genre} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Xác nhận xóa thể loại?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground/70">
            Bạn có chắc muốn xóa{" "}
            <strong className="text-foreground">"{genre?.name}"</strong>? Hành
            động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            disabled={isDeleting}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500/90 hover:bg-red-500 text-white border-0"
          >
            {isDeleting ? "Đang xóa..." : "Xóa thể loại"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
