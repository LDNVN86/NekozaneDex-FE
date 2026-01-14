import { Button } from "@/shared/ui/button";

interface StoriesPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StoriesPagination({
  page,
  totalPages,
  onPageChange,
}: StoriesPaginationProps) {
  // Ensure valid numbers with fallbacks
  const currentPage = Number.isFinite(page) ? page : 1;
  const maxPages =
    Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <p className="text-sm text-muted-foreground">
        Trang {currentPage} / {maxPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= maxPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
