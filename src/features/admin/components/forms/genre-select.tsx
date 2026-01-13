"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Badge } from "@/shared/ui/badge";
import type { Genre } from "../../interface";

interface GenreSelectProps {
  genres: Genre[];
  defaultValue?: string[];
}

export function GenreSelect({ genres, defaultValue = [] }: GenreSelectProps) {
  const [selected, setSelected] = React.useState<string[]>(defaultValue);
  const [open, setOpen] = React.useState(false);

  const toggleGenre = (genreId: string) => {
    setSelected((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const removeGenre = (genreId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => prev.filter((id) => id !== genreId));
  };

  const selectedGenres = genres.filter((g) => selected.includes(g.id));

  return (
    <div className="space-y-3">
      {/* Hidden inputs for form submission */}
      {selected.map((id) => (
        <input key={id} type="hidden" name="genre_ids" value={id} />
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-input border-border/30 hover:bg-input/80 text-sm h-10"
          >
            <span className="text-muted-foreground truncate">
              {selected.length > 0
                ? `${selected.length} thể loại đã chọn`
                : "Chọn thể loại..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm thể loại..." className="h-9" />
            <CommandList>
              <CommandEmpty>Không tìm thấy thể loại</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {genres.map((genre) => (
                  <CommandItem
                    key={genre.id}
                    value={genre.name}
                    onSelect={() => toggleGenre(genre.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(genre.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {genre.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedGenres.map((genre) => (
            <Badge
              key={genre.id}
              variant="secondary"
              className="bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30 cursor-pointer text-xs py-0.5"
            >
              {genre.name}
              <button
                type="button"
                onClick={(e) => removeGenre(genre.id, e)}
                className="ml-1 hover:text-violet-100"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
