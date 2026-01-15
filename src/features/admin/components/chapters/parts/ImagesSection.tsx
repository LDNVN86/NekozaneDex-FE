"use client";

import * as React from "react";
import { Image } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import type { ChapterFieldErrors } from "../../../interface";

interface ImagesSectionProps {
  images: string;
  setImages: (value: string) => void;
  imageCount: number;
  fieldErrors?: ChapterFieldErrors;
}

export function ImagesSection({
  images,
  setImages,
  imageCount,
  fieldErrors,
}: ImagesSectionProps) {
  return (
    <Card className="glass-card p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <Image className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">URLs ảnh</h2>
            <p className="text-sm text-muted-foreground">Mỗi dòng = 1 trang</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {imageCount} ảnh
        </Badge>
      </div>

      <textarea
        id="images"
        name="images"
        value={images}
        onChange={(e) => setImages(e.target.value)}
        placeholder="Nhập mỗi URL ảnh trên một dòng...&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
        rows={14}
        className={`w-full px-4 py-3 bg-input border border-border/30 rounded-lg text-foreground placeholder-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
          fieldErrors?.images
            ? "border-red-500/50 focus:ring-red-500"
            : "focus:ring-emerald-500"
        }`}
      />
      {fieldErrors?.images && (
        <p className="text-red-500 text-sm mt-2">{fieldErrors.images}</p>
      )}
    </Card>
  );
}
