"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";

export type CommentSortOption = "newest" | "oldest" | "top";

interface CommentSortSelectProps {
  value: CommentSortOption;
  onChange: (value: CommentSortOption) => void;
}

const sortOptions: { value: CommentSortOption; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "top", label: "Nhiều like nhất" },
];

export function CommentSortSelect({ value, onChange }: CommentSortSelectProps) {
  const currentLabel =
    sortOptions.find((opt) => opt.value === value)?.label || "Mới nhất";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(value === option.value && "bg-accent")}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
