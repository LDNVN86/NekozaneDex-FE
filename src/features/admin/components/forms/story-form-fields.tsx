"use client";

import * as React from "react";
import { User, Globe, FileText, Calendar, MapPin, Palette } from "lucide-react";
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

const COUNTRY_OPTIONS = [
  { value: "", label: "Chọn quốc gia" },
  { value: "JP", label: "Nhật Bản (JP)" },
  { value: "CN", label: "Trung Quốc (CN)" },
  { value: "KR", label: "Hàn Quốc (KR)" },
  { value: "VN", label: "Việt Nam (VN)" },
  { value: "US", label: "Mỹ (US)" },
  { value: "OTHER", label: "Khác" },
];

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
      if (Array.isArray(val)) return val.join(", ");
      return typeof val === "string" || typeof val === "number"
        ? String(val)
        : "";
    }
    if (story) {
      const storyVal = story[key as keyof AdminStory];
      if (Array.isArray(storyVal)) return storyVal.join(", ");
      return typeof storyVal === "string" || typeof storyVal === "number"
        ? String(storyVal)
        : "";
    }
    return "";
  };

  const inputClass =
    "w-full pl-10 pr-3 py-2.5 bg-input border border-border/30 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all";
  const selectClass =
    "w-full pl-10 pr-3 py-2.5 bg-input border border-border/30 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all";

  return (
    <div className="space-y-6">
      {/* Section: Thông tin cơ bản */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b border-border/30 pb-2">
          Thông tin cơ bản
        </h3>

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
              className={inputClass}
            />
          </div>
          {errors?.title && (
            <p className="text-destructive text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Original Title */}
        <div>
          <label
            htmlFor="original_title"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Tên gốc (JP/CN/KR)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="original_title"
              name="original_title"
              type="text"
              defaultValue={getValue("original_title")}
              placeholder="例えば: となりの猫と恋知らず"
              className={inputClass}
            />
          </div>
        </div>

        {/* Alt Titles */}
        <div>
          <label
            htmlFor="alt_titles"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Tên khác (phân cách bằng dấu phẩy)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="alt_titles"
              name="alt_titles"
              type="text"
              defaultValue={getValue("alt_titles")}
              placeholder="Tên 1, Tên 2, Tên 3"
              className={inputClass}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Các tên phụ, phân cách bằng dấu phẩy
          </p>
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
          <input
            type="hidden"
            name="description"
            value={cleanHtml(description)}
          />
          {errors?.description && (
            <p className="text-destructive text-xs mt-1">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Section: Tác giả & Nguồn */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b border-border/30 pb-2">
          Tác giả & Nguồn
        </h3>

        {/* Grid: Author + Artist */}
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
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="artist_name"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Họa sĩ
            </label>
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="artist_name"
                name="artist_name"
                type="text"
                defaultValue={getValue("artist_name")}
                placeholder="Tên họa sĩ"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Translator */}
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
              className={inputClass}
            />
          </div>
        </div>

        {/* Grid: Source URL + Source Name */}
        <div className="grid grid-cols-2 gap-3">
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
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="source_name"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Tên nguồn
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="source_name"
                name="source_name"
                type="text"
                defaultValue={getValue("source_name")}
                placeholder="MangaDex, Komikindo..."
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Thông tin xuất bản */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b border-border/30 pb-2">
          Thông tin xuất bản
        </h3>

        {/* Grid: Country + Release Year + End Year */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="country"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Quốc gia
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                id="country"
                name="country"
                defaultValue={getValue("country")}
                className={selectClass}
              >
                {COUNTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="release_year"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Năm ra mắt
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="release_year"
                name="release_year"
                type="number"
                min="1900"
                max="2100"
                defaultValue={getValue("release_year")}
                placeholder="2024"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="end_year"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Năm kết thúc
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="end_year"
                name="end_year"
                type="number"
                min="1900"
                max="2100"
                defaultValue={getValue("end_year")}
                placeholder="Trống = Đang tiếp diễn"
                className={inputClass}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Để trống năm kết thúc nếu truyện vẫn đang tiếp diễn
        </p>
      </div>
    </div>
  );
}
