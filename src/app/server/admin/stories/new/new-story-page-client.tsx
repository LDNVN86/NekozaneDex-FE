"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { StoryForm } from "@/features/admin";
import { createStoryAction } from "@/features/admin/actions";
import type { Genre } from "@/features/admin/interface";

interface NewStoryPageClientProps {
  genres: Genre[];
}

export function NewStoryPageClient({ genres }: NewStoryPageClientProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/server/admin/stories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Thêm truyện mới</h1>
          <p className="text-muted-foreground">Tạo truyện mới cho hệ thống</p>
        </div>
      </div>

      {/* Form */}
      <StoryForm genres={genres} action={createStoryAction} />
    </>
  );
}
