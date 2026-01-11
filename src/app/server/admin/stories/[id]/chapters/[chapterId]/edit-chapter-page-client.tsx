"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ChapterForm } from "@/features/admin";
import { updateChapterAction } from "@/features/admin/actions";
import type { AdminStory, AdminChapter } from "@/features/admin/interface";

interface EditChapterPageClientProps {
  story: AdminStory;
  chapter: AdminChapter;
}

export function EditChapterPageClient({
  story,
  chapter,
}: EditChapterPageClientProps) {
  const boundAction = updateChapterAction.bind(null, chapter.id, story.id);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/server/admin/stories/${story.id}/chapters`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Chỉnh sửa chapter</h1>
          <p className="text-muted-foreground">
            {story.title} - Chapter {chapter.chapter_number}
          </p>
        </div>
      </div>

      {/* Chapter Form */}
      <div className="max-w-2xl">
        <ChapterForm chapter={chapter} action={boundAction} />
      </div>
    </>
  );
}
