"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ChapterForm } from "@/features/admin";
import { createChapterAction } from "@/features/admin/actions";
import type { AdminStory, ChapterFormState } from "@/features/admin/interface";

interface NewChapterPageClientProps {
  story: AdminStory;
}

export function NewChapterPageClient({ story }: NewChapterPageClientProps) {
  // Bind storyId to the action
  const boundAction = async (
    prevState: ChapterFormState,
    formData: FormData
  ): Promise<ChapterFormState> => {
    return createChapterAction(story.id, prevState, formData);
  };

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
          <h1 className="text-2xl font-bold">Thêm chapter mới</h1>
          <p className="text-muted-foreground">{story.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <ChapterForm action={boundAction} />
      </div>
    </>
  );
}
