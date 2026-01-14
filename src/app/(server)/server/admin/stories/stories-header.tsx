import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface StoriesHeaderProps {
  total: number;
  searchQuery?: string;
}

export function StoriesHeader({ total, searchQuery }: StoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý truyện</h1>
        <p className="text-muted-foreground">
          {searchQuery ? (
            <>
              Tìm thấy {total} truyện cho "{searchQuery}"
            </>
          ) : (
            <>Tổng cộng {total} truyện</>
          )}
        </p>
      </div>
      <Link href="/server/admin/stories/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm truyện mới
        </Button>
      </Link>
    </div>
  );
}
