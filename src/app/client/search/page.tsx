import { Suspense } from "react";
import { SearchContent } from "@/features/search/components/search-content";

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Đang tải...</div>}
    >
      <SearchContent />
    </Suspense>
  );
}
