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
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/server/admin/stories">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Form */}
      <StoryForm genres={genres} action={createStoryAction} />
    </>
  );
}
