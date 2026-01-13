"use client";

import * as React from "react";
import { User, Globe, FileText } from "lucide-react";
import { RichTextEditor } from "@/shared/components/rich-text-editor";
import { cleanHtml } from "@/shared/lib/html-utils";
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
  const [description, setDescription] = React.useState(
    values?.description || story?.description || ""
  );

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
      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block text-xs font-medium text-muted-foreground mb-1.5"
        >
          Tiêu đề <span className="text-violet-400">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={getValue("title")}
            placeholder="Nhập tiêu đề truyện"
            required
            className="w-full pl-10 pr-4 py-2.5 bg-input border border-border/30 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
        {errors?.title && (
          <p className="text-destructive text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description Field - Rich Text Editor */}
      <div>
        <label
          htmlFor="description"
          className="block text-xs font-medium text-muted-foreground mb-1.5"
        >
          Mô tả
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Nhập mô tả truyện..."
        />
        {/* Hidden input for form submission */}
        <input
          type="hidden"
          name="description"
          value={cleanHtml(description)}
        />
        {errors?.description && (
          <p className="text-destructive text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Grid: Author + Translator */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="author_name"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Tác giả
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="author_name"
              name="author_name"
              type="text"
              defaultValue={getValue("author_name")}
              placeholder="Tên tác giả"
              className="w-full pl-10 pr-3 py-2.5 bg-input border border-border/30 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          {errors?.author_name && (
            <p className="text-destructive text-xs mt-1">
              {errors.author_name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="translator"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Người dịch
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="translator"
              name="translator"
              type="text"
              defaultValue={getValue("translator")}
              placeholder="Tên người dịch"
              className="w-full pl-10 pr-3 py-2.5 bg-input border border-border/30 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          {errors?.translator && (
            <p className="text-destructive text-xs mt-1">{errors.translator}</p>
          )}
        </div>
      </div>

      {/* Source URL */}
      <div>
        <label
          htmlFor="source_url"
          className="block text-xs font-medium text-muted-foreground mb-1.5"
        >
          Link nguồn
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="source_url"
            name="source_url"
            type="url"
            defaultValue={getValue("source_url")}
            placeholder="https://example.com"
            className="w-full pl-10 pr-3 py-2.5 bg-input border border-border/30 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
        {errors?.source_url && (
          <p className="text-destructive text-xs mt-1">{errors.source_url}</p>
        )}
      </div>
    </div>
  );
}
