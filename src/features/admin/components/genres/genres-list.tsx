"use client";

import * as React from "react";
import { Plus, Tag, Search, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { Genre } from "../../interface";
import { deleteGenreAction } from "../../actions/genre-actions";
import { GenreCard } from "./genre-card";
import {
  CreateGenreDialog,
  EditGenreDialog,
  DeleteGenreDialog,
} from "./genre-dialogs";

interface GenresListProps {
  genres: Genre[];
}

export function GenresList({ genres }: GenresListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingGenre, setEditingGenre] = React.useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = React.useState<Genre | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filteredGenres = React.useMemo(
    () =>
      genres.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.slug.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [genres, searchTerm]
  );

  const handleDelete = async () => {
    if (!deletingGenre) return;
    setIsDeleting(true);
    const result = await deleteGenreAction(deletingGenre.id);
    if (result.success) {
      toast.success("Đã xóa thể loại!");
    } else {
      toast.error(result.message || "Không thể xóa thể loại");
    }
    setIsDeleting(false);
    setDeletingGenre(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 ring-1 ring-emerald-500/20">
            <BookOpen className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Thể loại
            </h1>
            <p className="text-muted-foreground mt-0.5">
              Quản lý {genres.length} thể loại truyện
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
              <Input
                type="text"
                placeholder="Tìm kiếm thể loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 bg-transparent border-0 text-base placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredGenres.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-4">
              <Tag className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              {searchTerm ? "Không tìm thấy kết quả" : "Chưa có thể loại nào"}
            </h3>
            <p className="text-muted-foreground/60 text-sm max-w-sm">
              {searchTerm
                ? `Không có thể loại nào phù hợp với "${searchTerm}"`
                : "Thêm thể loại đầu tiên để bắt đầu phân loại truyện"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGenres.map((genre) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                onEdit={() => setEditingGenre(genre)}
                onDelete={() => setDeletingGenre(genre)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB - Floating Action Button */}
      <Button
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200 z-50"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Dialogs */}
      <CreateGenreDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditGenreDialog
        genre={editingGenre}
        onClose={() => setEditingGenre(null)}
      />
      <DeleteGenreDialog
        genre={deletingGenre}
        isDeleting={isDeleting}
        onClose={() => setDeletingGenre(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
