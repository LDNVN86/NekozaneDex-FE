import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import type {
  AdminStory,
  StoryFieldErrors,
  StoryFormData,
} from "../../interface";

interface StoryFormFieldsProps {
  story?: AdminStory;
  errors?: StoryFieldErrors;
  values?: StoryFormData;
}

export function StoryFormFields({
  story,
  errors,
  values,
}: StoryFormFieldsProps) {
  const getValue = (key: keyof StoryFormData): string => {
    if (values?.[key] !== undefined) {
      const val = values[key];
      return typeof val === "string" ? val : "";
    }
    if (story) {
      const storyVal = story[key as keyof AdminStory];
      return typeof storyVal === "string" ? storyVal : "";
    }
    return "";
  };
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Tên truyện <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={getValue("title") as string}
          placeholder="Nhập tên truyện"
          required
        />
        {errors?.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={getValue("description") as string}
          placeholder="Nhập mô tả truyện..."
          rows={5}
        />
        {errors?.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Author & Translator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author_name">Tác giả</Label>
          <Input
            id="author_name"
            name="author_name"
            defaultValue={getValue("author_name") as string}
            placeholder="Tên tác giả"
          />
          {errors?.author_name && (
            <p className="text-sm text-destructive">{errors.author_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="translator">Dịch giả</Label>
          <Input
            id="translator"
            name="translator"
            defaultValue={getValue("translator") as string}
            placeholder="Tên dịch giả"
          />
          {errors?.translator && (
            <p className="text-sm text-destructive">{errors.translator}</p>
          )}
        </div>
      </div>

      {/* Source URL */}
      <div className="space-y-2">
        <Label htmlFor="source_url">Link nguồn</Label>
        <Input
          id="source_url"
          name="source_url"
          type="url"
          defaultValue={getValue("source_url") as string}
          placeholder="https://example.com/manga"
        />
        {errors?.source_url && (
          <p className="text-sm text-destructive">{errors.source_url}</p>
        )}
      </div>
    </div>
  );
}
