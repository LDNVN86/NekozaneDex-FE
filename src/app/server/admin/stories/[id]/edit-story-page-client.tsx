"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { StoryForm } from "@/features/admin";
import { updateStoryAction } from "@/features/admin/actions";
import type {
  AdminStory,
  Genre,
  StoryFormState,
} from "@/features/admin/interface";

interface EditStoryPageClientProps {
  story: AdminStory;
  genres: Genre[];
}

export function EditStoryPageClient({
  story,
  genres,
}: EditStoryPageClientProps) {
  // Bind storyId to the action
  const boundAction = async (
    prevState: StoryFormState,
    formData: FormData
  ): Promise<StoryFormState> => {
    return updateStoryAction(story.id, prevState, formData);
  };

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
          <h1 className="text-2xl font-bold">Chỉnh sửa truyện</h1>
          <p className="text-muted-foreground">{story.title}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex gap-2 mb-6">
        <Link href={`/server/admin/stories/${story.id}/chapters`}>
          <Button variant="outline" size="sm">
            Quản lý chapters ({story.total_chapters})
          </Button>
        </Link>
        <Link href={`/client/stories/${story.slug}`} target="_blank">
          <Button variant="outline" size="sm">
            Xem trang truyện
          </Button>
        </Link>
      </div>

      {/* Form */}
      <StoryForm story={story} genres={genres} action={boundAction} />
    </>
  );
}
