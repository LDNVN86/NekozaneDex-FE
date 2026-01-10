"use client";

import { Filter } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Checkbox } from "@/shared/ui/checkbox";
import { genres } from "@/features/story/data/mock-data";

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "ongoing", label: "Đang ra" },
  { value: "completed", label: "Hoàn thành" },
];

interface FilterSidebarProps {
  selectedGenres: string[];
  status: string;
  onGenreToggle: (genreId: string) => void;
  onStatusChange: (status: string) => void;
  onApplyFilters: () => void;
}

export function FilterSidebar({
  selectedGenres,
  status,
  onGenreToggle,
  onStatusChange,
  onApplyFilters,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 p-6 rounded-xl bg-card border">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ lọc
        </h2>
        <FilterContent
          selectedGenres={selectedGenres}
          status={status}
          onGenreToggle={onGenreToggle}
          onStatusChange={onStatusChange}
          onApplyFilters={onApplyFilters}
        />
      </div>
    </aside>
  );
}

interface FilterContentProps {
  selectedGenres: string[];
  status: string;
  onGenreToggle: (genreId: string) => void;
  onStatusChange: (status: string) => void;
  onApplyFilters: () => void;
}

export function FilterContent({
  selectedGenres,
  status,
  onGenreToggle,
  onStatusChange,
  onApplyFilters,
}: FilterContentProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Genre Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Thể loại</Label>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center gap-2">
              <Checkbox
                id={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onCheckedChange={() => onGenreToggle(genre.id)}
              />
              <label
                htmlFor={genre.id}
                className="text-sm cursor-pointer flex-1 flex justify-between"
              >
                <span>{genre.name}</span>
                <span className="text-muted-foreground">({genre.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Trạng thái</Label>
        <RadioGroup value={status} onValueChange={onStatusChange}>
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                id={`status-${option.value}`}
              />
              <Label
                htmlFor={`status-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Apply Button */}
      <Button onClick={onApplyFilters} className="w-full">
        Áp dụng bộ lọc
      </Button>
    </div>
  );
}
