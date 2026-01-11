"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AvatarUpload, uploadAvatarBlob } from "./avatar-upload";
import { updateProfileAction } from "@/features/profile/actions";

interface ProfileInfoCardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const router = useRouter();
  const [username, setUsername] = React.useState(user.name);
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatar || "");
  const [pendingBlob, setPendingBlob] = React.useState<Blob | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Track initial values to properly detect changes
  const initialAvatar = React.useRef(user.avatar || "");

  const handleAvatarChange = (url: string, blob?: Blob) => {
    if (blob) {
      // User cropped an image - store the blob for later upload
      setPendingBlob(blob);
    } else if (url) {
      // URL was set directly (shouldn't happen in new flow)
      setAvatarUrl(url);
      setPendingBlob(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let newAvatarUrl = avatarUrl;

      // Upload pending blob if exists
      if (pendingBlob) {
        try {
          newAvatarUrl = await uploadAvatarBlob(pendingBlob);
          setAvatarUrl(newAvatarUrl);
          setPendingBlob(null);
        } catch (uploadError) {
          console.error("[ProfileInfoCard] Upload error:", uploadError);
          toast.error("Không thể upload ảnh");
          setIsUpdating(false);
          return;
        }
      }

      // Update profile with username and/or avatar URL
      const formData = new FormData();
      if (username !== user.name) formData.append("username", username);
      if (newAvatarUrl && newAvatarUrl !== initialAvatar.current) {
        formData.append("avatar_url", newAvatarUrl);
        // Also send old avatar URL for deletion
        if (initialAvatar.current) {
          formData.append("old_avatar_url", initialAvatar.current);
        }
      }

      const result = await updateProfileAction(formData);

      if (result.success) {
        toast.success("Cập nhật thông tin thành công");
        // Update initial values after successful save
        initialAvatar.current = newAvatarUrl;
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    username !== user.name ||
    avatarUrl !== initialAvatar.current ||
    pendingBlob !== null;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <AvatarUpload
              currentAvatar={avatarUrl || user.avatar}
              onAvatarChange={handleAvatarChange}
              pendingBlob={pendingBlob}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Tên hiển thị</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên hiển thị"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                value={user.email}
                disabled
                className="pr-10 cursor-not-allowed opacity-60"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Email không thể thay đổi
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isUpdating || !hasChanges}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
