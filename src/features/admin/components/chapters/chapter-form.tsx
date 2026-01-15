"use client";

import * as React from "react";
import { useActionState, startTransition } from "react";
import type { AdminChapter, ChapterFormState } from "../../interface";
import { extractChapterNumber } from "./chapter-form-utils";

// Parts
import { InfoSection } from "./parts/InfoSection";
import { ImagesSection } from "./parts/ImagesSection";
import { FormPreviewSidebar } from "./parts/FormPreviewSidebar";

interface ChapterFormProps {
  chapter?: AdminChapter;
  action: (
    prevState: ChapterFormState,
    formData: FormData
  ) => Promise<ChapterFormState>;
  onCancel?: () => void;
}

const initialState: ChapterFormState = { success: false };

export function ChapterForm({ chapter, action, onCancel }: ChapterFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  // Form State
  const [title, setTitle] = React.useState(chapter?.title || "");
  const [chapterLabel, setChapterLabel] = React.useState(
    chapter?.chapter_label || ""
  );
  const [chapterType, setChapterType] = React.useState(
    chapter?.chapter_type || "regular"
  );
  const [ordering, setOrdering] = React.useState(
    chapter?.ordering?.toString() || ""
  );
  const [images, setImages] = React.useState(chapter?.images?.join("\n") || "");

  const formRef = React.useRef<HTMLFormElement>(null);

  // Derived State
  const detectedChapterNumber = extractChapterNumber(title);
  const imageCount = images
    .split("\n")
    .filter((url) => url.trim().length > 0).length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <InfoSection
            title={title}
            setTitle={setTitle}
            chapterLabel={chapterLabel}
            setChapterLabel={setChapterLabel}
            chapterType={chapterType}
            setChapterType={setChapterType}
            ordering={ordering}
            setOrdering={setOrdering}
            detectedChapterNumber={detectedChapterNumber}
            fieldErrors={state.fieldErrors}
          />

          <ImagesSection
            images={images}
            setImages={setImages}
            imageCount={imageCount}
            fieldErrors={state.fieldErrors}
          />
        </div>

        {/* Sidebar - Right column */}
        <div className="space-y-6">
          <FormPreviewSidebar
            chapterLabel={chapterLabel}
            detectedChapterNumber={detectedChapterNumber}
            chapterType={chapterType}
            imageCount={imageCount}
            ordering={ordering}
            state={state}
            isPending={isPending}
            isEdit={!!chapter}
            onCancel={onCancel}
          />
        </div>
      </div>
    </form>
  );
}
