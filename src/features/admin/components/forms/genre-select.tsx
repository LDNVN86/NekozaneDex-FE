"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import type { Genre } from "../../interface";

interface GenreSelectProps {
  genres: Genre[];
  defaultValue?: string[];
}

export function GenreSelect({ genres, defaultValue = [] }: GenreSelectProps) {
  const [selected, setSelected] = React.useState<string[]>(defaultValue);

  const toggleGenre = (genreId: string) => {
    setSelected((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Thể loại</CardTitle>
      </CardHeader>
      <CardContent>
        {genres.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có thể loại nào</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre.id}`}
                  name="genre_ids"
                  value={genre.id}
                  checked={selected.includes(genre.id)}
                  onCheckedChange={() => toggleGenre(genre.id)}
                />
                <Label
                  htmlFor={`genre-${genre.id}`}
                  className="text-sm cursor-pointer leading-none"
                >
                  {genre.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
