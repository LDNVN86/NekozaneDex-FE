"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { uploadImageAction } from "../../actions/upload-actions";

interface ImageUploadProps {
  name: string;
  label: string;
  defaultValue?: string;
}

export function ImageUpload({ name, label, defaultValue }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    defaultValue
  );
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "covers");

      const result = await uploadImageAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setImageUrl(result.url);
      toast.success("Upload ảnh thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể upload ảnh"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn (tối đa 10MB)");
      return;
    }

    uploadToCloudinary(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClick = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center
            transition-colors
            ${isUploading ? "cursor-wait opacity-70" : "cursor-pointer"}
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }
            ${imageUrl || isUploading ? "" : "hover:bg-muted/50"}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="py-8 flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang upload...</p>
            </div>
          ) : imageUrl ? (
            <div className="relative">
              <div className="relative w-full h-40">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="py-8">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Kéo thả hoặc click để upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP (max 10MB)
              </p>
            </div>
          )}
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading}
          />
          {/* Hidden input to submit the Cloudinary URL */}
          <input type="hidden" name={`${name}_url`} value={imageUrl || ""} />
        </div>
      </CardContent>
    </Card>
  );
}
