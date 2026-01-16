import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: PaginationProps) {
  // Generate visible page numbers (show 5 pages centered on current)
  const getVisiblePages = () => {
    const pagesList: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pagesList.push(i);
    }
    return pagesList;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      {/* First Page */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            size="icon"
            className={cn(
              "h-8 w-8 text-sm",
              page === currentPage && "bg-primary text-primary-foreground",
            )}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next Page */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
