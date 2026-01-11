"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { AdminStory, Genre, StoryFormState } from "../../interface";
import { StoryFormFields } from "./story-form-fields";
import { ImageUpload } from "./image-upload";
import { GenreSelect } from "./genre-select";
import { StatusSelect } from "./status-select";

interface StoryFormProps {
  story?: AdminStory;
  genres: Genre[];
  action: (
    prevState: StoryFormState,
    formData: FormData
  ) => Promise<StoryFormState>;
}

const initialState: StoryFormState = { success: false };

export function StoryForm({ story, genres, action }: StoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin truyện</CardTitle>
            </CardHeader>
            <CardContent>
              <StoryFormFields
                story={story}
                errors={state.fieldErrors}
                values={state.values}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ImageUpload
            name="cover_image_url"
            label="Ảnh bìa"
            defaultValue={story?.cover_image_url}
          />

          <GenreSelect
            genres={genres}
            defaultValue={story?.genres?.map((g) => g.id)}
          />

          <StatusSelect
            defaultStatus={story?.status}
            defaultPublished={story?.is_published}
          />

          <Card>
            <CardContent className="pt-6 space-y-3">
              {state.message && (
                <p
                  className={`text-sm ${
                    state.success ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {state.message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending
                  ? "Đang xử lý..."
                  : story
                  ? "Cập nhật truyện"
                  : "Tạo truyện mới"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
