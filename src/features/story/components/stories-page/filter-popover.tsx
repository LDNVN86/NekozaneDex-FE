"use client";

import * as React from "react";
import { Filter, ChevronDown, X, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";
import type { Genre } from "@/features/story/interface/story-interface";

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "ongoing", label: "Đang ra" },
  { value: "completed", label: "Hoàn thành" },
];

interface FilterPopoverProps {
  genres: Genre[];
  selectedGenres: string[];
  status: string;
  onGenreToggle: (genreSlug: string) => void;
  onStatusChange: (status: string) => void;
  onClearAll: () => void;
}

export function FilterPopover({
  genres,
  selectedGenres,
  status,
  onGenreToggle,
  onStatusChange,
  onClearAll,
}: FilterPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const activeFiltersCount = selectedGenres.length + (status !== "all" ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2",
            activeFiltersCount > 0 && "border-primary text-primary",
          )}
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Bộ lọc</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => {
                  onClearAll();
                  onStatusChange("all");
                }}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        {/* Status filter */}
        <div className="p-4 border-b">
          <p className="text-sm font-medium mb-3">Trạng thái</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={status === option.value ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Genres filter */}
        <div className="p-4 max-h-[300px] overflow-y-auto">
          <p className="text-sm font-medium mb-3">
            Thể loại
            {selectedGenres.length > 0 && (
              <span className="text-muted-foreground ml-2">
                ({selectedGenres.length} đã chọn)
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre.slug);
              return (
                <Button
                  key={genre.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn("h-7 text-xs", isSelected && "pr-2")}
                  onClick={() => onGenreToggle(genre.slug)}
                >
                  {genre.name}
                  {isSelected && <Check className="h-3 w-3 ml-1" />}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
