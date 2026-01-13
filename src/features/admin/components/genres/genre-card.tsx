"use client";

import { Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import type { Genre } from "../../interface";

interface GenreCardProps {
  genre: Genre;
  onEdit: () => void;
  onDelete: () => void;
}

export function GenreCard({ genre, onEdit, onDelete }: GenreCardProps) {
  return (
    <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(16,185,129,0.12)]">
      {/* Action buttons - top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 border border-transparent hover:border-amber-500/30"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Genre name */}
      <h3 className="text-lg font-semibold text-foreground mb-2 pr-20 leading-tight">
        {genre.name}
      </h3>

      {/* Slug badge */}
      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-medium px-2.5 py-0.5 rounded-md hover:bg-emerald-500/25 transition-colors">
        Slug: {genre.slug}
      </Badge>

      {/* Description */}
      <div className="mt-4">
        {genre.description ? (
          <p className="text-sm text-muted-foreground/70 line-clamp-3 leading-relaxed">
            {genre.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/40 italic flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Chưa có mô tả
          </p>
        )}
      </div>
    </div>
  );
}
