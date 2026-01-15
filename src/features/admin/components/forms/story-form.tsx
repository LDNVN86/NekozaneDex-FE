"use client";

import * as React from "react";
import { useActionState, startTransition } from "react";
import { Loader2, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import type { AdminStory, Genre, StoryFormState } from "../../interface";
import { StoryFormFields } from "./story-form-fields";
import { ImageUpload } from "./image-upload";
import { GenreSelect } from "./genre-select";
import { StatusSelect } from "./status-select";
import { uploadImageAction } from "../../actions/upload-actions";

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
  const [pendingCoverFile, setPendingCoverFile] = React.useState<Blob | null>(
    null
  );
  const [isUploading, setIsUploading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleCoverFileChange = (file: Blob | null) => {
    setPendingCoverFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    // If we have a pending cover file, upload it first
    if (pendingCoverFile) {
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("image", pendingCoverFile, "cover.jpg");
        uploadFormData.append("folder", "covers");

        const uploadResult = await uploadImageAction(uploadFormData);

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Upload ảnh thất bại");
          setIsUploading(false);
          return;
        }

        // Replace the hidden input value with the new URL
        formData.set("cover_image_url_url", uploadResult.url || "");
        toast.success("Upload ảnh thành công!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Không thể upload ảnh");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Now submit the form with all data - wrapped in startTransition for useActionState
    startTransition(() => {
      formAction(formData);
    });
  };

  const isProcessing = isPending || isUploading;

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-violet-500/20">
          <BookOpen className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {story ? "Chỉnh sửa truyện" : "Thêm truyện mới"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {story
              ? `Đang chỉnh sửa: ${story.title}`
              : "Điền thông tin để tạo truyện"}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cover Image */}
        <div className="lg:col-span-3">
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm sticky top-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span>
              Ảnh bìa
            </h3>
            <ImageUpload
              name="cover_image_url"
              defaultValue={story?.cover_image_url}
              onFileChange={handleCoverFileChange}
              aspectRatio={2 / 3}
            />
          </Card>
        </div>

        {/* Center: Form Fields */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="glass-card p-5 border-border/50 bg-card/50 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Thông tin truyện
            </h3>
            <StoryFormFields
              story={story}
              errors={state.fieldErrors}
              values={state.values}
            />
          </Card>
        </div>

        {/* Right: Settings & Actions */}
        <div className="lg:col-span-3 space-y-4">
          {/* Genre */}
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Thể loại
            </h3>
            <GenreSelect
              genres={genres}
              defaultValue={story?.genres?.map((g) => g.id)}
            />
          </Card>

          {/* Status */}
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Xuất bản
            </h3>
            <StatusSelect
              defaultStatus={story?.status}
              defaultPublished={story?.is_published}
            />
          </Card>

          {/* Actions - Sticky */}
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm sticky top-4">
            {state.success && state.message && (
              <Alert className="mb-3 bg-green-500/20 border-green-500/50">
                <AlertDescription className="text-green-300 text-sm">
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            {!state.success && state.message && (
              <Alert className="mb-3 bg-destructive/20 border-destructive/50">
                <AlertDescription className="text-red-300 text-sm">
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Đang lưu..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {story ? "Cập nhật" : "Tạo truyện"}
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </form>
  );
}
