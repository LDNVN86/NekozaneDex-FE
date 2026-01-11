"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageCropModal } from "@/shared/components/image-crop-modal";

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (url: string, blob?: Blob) => void;
  pendingBlob?: Blob | null;
}

export function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  pendingBlob,
}: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string>(currentAvatar || "");
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Update preview when pendingBlob changes or when currentAvatar changes
  React.useEffect(() => {
    if (pendingBlob) {
      const blobUrl = URL.createObjectURL(pendingBlob);
      setPreview(blobUrl);
      return () => URL.revokeObjectURL(blobUrl);
    } else {
      setPreview(currentAvatar || "");
    }
  }, [pendingBlob, currentAvatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow selecting same file again
    e.target.value = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 10MB for source image before cropping)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File ảnh không được vượt quá 10MB");
      return;
    }

    // Create preview and open crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setCropModalOpen(false);
    // Pass blob to parent - upload will happen when user clicks "Save"
    onAvatarChange("", croppedBlob);
    toast.info("Ảnh đã được chuẩn bị. Bấm 'Lưu thay đổi' để lưu.");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="relative w-24 h-24">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/50 to-primary p-0.5">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover bg-background"
              unoptimized={preview.startsWith("blob:")}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              ?
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 rounded-full p-2 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
        cropShape="round"
      />
    </>
  );
}

// Helper function to upload avatar blob - called from parent component
export async function uploadAvatarBlob(blob: Blob): Promise<string> {
  // Dynamic import to avoid circular dependency issues
  const { refreshTokens } = await import("@/shared/lib/client-fetch");

  const formData = new FormData();
  formData.append("image", blob, "avatar.jpg");

  let res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  // If 401, try to refresh token and retry
  if (res.status === 401) {
    console.log("[uploadAvatarBlob] Got 401, attempting token refresh...");
    const refreshed = await refreshTokens();

    if (refreshed) {
      // Rebuild formData since it was consumed
      const retryFormData = new FormData();
      retryFormData.append("image", blob, "avatar.jpg");

      res = await fetch("/api/upload", {
        method: "POST",
        body: retryFormData,
        credentials: "include",
      });
    }
  }

  const responseData = await res.json();

  if (!res.ok || !responseData.success) {
    throw new Error(responseData.error || "Upload failed");
  }

  const uploadedUrl = responseData.data?.url || responseData.url;

  if (!uploadedUrl) {
    throw new Error("Không nhận được URL ảnh");
  }

  return uploadedUrl;
}
