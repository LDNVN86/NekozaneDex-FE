"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { ImageCropModal } from "@/shared/components/image-crop-modal";

interface ImageUploadProps {
  name: string;
  label?: string;
  defaultValue?: string;
  onFileChange?: (file: Blob | null) => void;
  aspectRatio?: number;
}

export function ImageUpload({
  name,
  defaultValue,
  onFileChange,
  aspectRatio = 2 / 3, // Book cover aspect ratio
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    defaultValue
  );
  const [pendingBlob, setPendingBlob] = React.useState<Blob | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState("");
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Create preview URL from blob
  const previewUrl = React.useMemo(() => {
    if (pendingBlob) {
      return URL.createObjectURL(pendingBlob);
    }
    return imageUrl;
  }, [pendingBlob, imageUrl]);

  // Cleanup blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (pendingBlob) {
        URL.revokeObjectURL(URL.createObjectURL(pendingBlob));
      }
    };
  }, [pendingBlob]);

  const handleFile = (file: File) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    setError("");

    if (!allowedFormats.includes(file.type)) {
      setError("Chỉ hỗ trợ PNG, JPG, WEBP");
      return;
    }

    if (file.size > maxSize) {
      setError("Tệp không được vượt quá 10MB");
      return;
    }

    // Open crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setCropModalOpen(false);
    setPendingBlob(croppedBlob);
    onFileChange?.(croppedBlob);
    toast.info("Ảnh đã sẵn sàng. Bấm 'Lưu' để upload.");
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
    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingBlob(null);
    setImageUrl(undefined);
    setError("");
    onFileChange?.(null);
  };

  const handleChangeImage = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div className="space-y-3">
        {/* Upload Zone - only show when no preview */}
        {!previewUrl && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
              ${
                isDragging
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-border/50 hover:border-violet-400/50 hover:bg-violet-500/5"
              }
            `}
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-foreground font-medium text-sm mb-1">
              Kéo thả hoặc click
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, WEBP (max 10MB)
            </p>
          </div>
        )}

        {error && (
          <Alert className="bg-destructive/20 border-destructive/50">
            <AlertDescription className="text-destructive text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Image Preview - Full aspect ratio display */}
        {previewUrl && (
          <div className="space-y-2">
            <div
              className="relative rounded-lg overflow-hidden bg-muted/30 border border-border/30"
              style={{ aspectRatio: `${aspectRatio}` }}
            >
              <Image
                src={previewUrl}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleChangeImage}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white flex items-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  Đổi ảnh
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-red-500/80 hover:bg-red-600 rounded-lg px-3 py-2 text-sm text-white flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>

            {pendingBlob && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                📎 Chờ lưu ({(pendingBlob.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
        />

        {/* Hidden input for existing URL (when no new file selected) */}
        <input
          type="hidden"
          name={`${name}_url`}
          value={pendingBlob ? "" : imageUrl || ""}
        />

        {/* Hidden input to signal that we have a pending file */}
        <input
          type="hidden"
          name={`${name}_has_pending`}
          value={pendingBlob ? "true" : "false"}
        />
      </div>

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={aspectRatio}
        cropShape="rect"
      />
    </>
  );
}
