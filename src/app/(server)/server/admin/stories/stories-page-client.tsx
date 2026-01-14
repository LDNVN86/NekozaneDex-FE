"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { AdminStory, Genre } from "@/features/admin/interface";
import { StoriesHeader } from "./stories-header";
import { StoriesSearchInput } from "./stories-search-input";
import { StoriesTable } from "@/features/admin/components/stories/stories-table";
import { StoriesPagination } from "./stories-pagination";
import { DeleteStoryDialog } from "./delete-story-dialog";

interface StoriesPageClientProps {
  stories: AdminStory[];
  genres: Genre[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  initialSearch?: string;
}

export function StoriesPageClient({
  stories,
  genres,
  pagination,
  initialSearch = "",
}: StoriesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  // Debounced search - update URL after user stops typing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      const newUrl = `/server/admin/stories?${params.toString()}`;
      const currentUrl = `/server/admin/stories?${searchParams.toString()}`;

      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/server/admin/stories?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/server/admin/stories?${params.toString()}`);
  };

  return (
    <>
      <StoriesHeader total={pagination.total} searchQuery={initialSearch} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Danh sách truyện</CardTitle>
              <CardDescription>
                Quản lý và chỉnh sửa truyện của bạn
              </CardDescription>
            </div>
            <StoriesSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={clearSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <StoriesTable
            stories={stories}
            onDelete={(id) => setDeleteId(id)}
            emptyMessage={
              initialSearch
                ? "Không tìm thấy truyện phù hợp"
                : "Chưa có truyện nào"
            }
          />
          <StoriesPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={goToPage}
          />
        </CardContent>
      </Card>

      <DeleteStoryDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        storyId={deleteId}
      />
    </>
  );
}
