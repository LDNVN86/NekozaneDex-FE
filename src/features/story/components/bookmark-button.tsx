"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
  storyId: string;
  initialBookmarked?: boolean;
  className?: string;
}

export function BookmarkButton({
  storyId,
  initialBookmarked = false,
  className,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/bookmarks/${storyId}`, {
          method: isBookmarked ? "DELETE" : "POST",
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Có lỗi xảy ra");
        }

        setIsBookmarked(!isBookmarked);
        toast.success(
          isBookmarked ? "Đã xóa khỏi đánh dấu" : "Đã thêm vào đánh dấu"
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
      }
    });
  };

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={cn("gap-2", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isBookmarked && "fill-current",
          isPending && "animate-pulse"
        )}
      />
      {isBookmarked ? "Đã đánh dấu" : "Đánh dấu"}
    </Button>
  );
}
