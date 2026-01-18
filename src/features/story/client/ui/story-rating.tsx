"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  rateStory,
  deleteMyRating,
  getMyRating,
  getStoryRating,
} from "../../actions/rating-actions";

interface StoryRatingProps {
  storyId: string;
  storySlug: string;
  initialRating?: number;
  initialRatingCount?: number;
  isAuthenticated?: boolean;
}

export function StoryRating({
  storyId,
  storySlug,
  initialRating,
  initialRatingCount = 0,
  isAuthenticated = false,
}: StoryRatingProps) {
  const [avgRating, setAvgRating] = React.useState(initialRating || 0);
  const [ratingCount, setRatingCount] = React.useState(initialRatingCount);
  const [myRating, setMyRating] = React.useState<number | null>(null);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch user's rating on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      getMyRating(storyId).then((res) => {
        if (res.success && res.data?.my_rating) {
          setMyRating(res.data.my_rating);
        }
      });
    }
  }, [storyId, isAuthenticated]);

  // Refresh rating from server
  const refreshRating = async () => {
    const res = await getStoryRating(storyId);
    if (res.success && res.data) {
      setAvgRating(res.data.avg_rating);
      setRatingCount(res.data.rating_count);
    }
  };

  // Handle rating click
  const handleRate = async (rating: number) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    // If clicking the same rating, remove it
    if (rating === myRating) {
      setIsLoading(true);
      const res = await deleteMyRating(storyId, storySlug);
      setIsLoading(false);

      if (res.success && res.data) {
        setMyRating(null);
        setAvgRating(res.data.avg_rating);
        setRatingCount(res.data.rating_count);
        toast.success("Đã xóa đánh giá");
      } else {
        toast.error(res.error || "Không thể xóa đánh giá");
      }
      return;
    }

    // Rate or update rating
    setIsLoading(true);
    const res = await rateStory(storyId, rating, storySlug);
    setIsLoading(false);

    if (res.success && res.data) {
      setMyRating(res.data.my_rating || rating);
      setAvgRating(res.data.avg_rating);
      setRatingCount(res.data.rating_count);
      toast.success(`Đã đánh giá ${rating} sao`);
    } else {
      toast.error(res.error || "Không thể đánh giá");
    }
  };

  const displayRating = hoverRating || myRating || 0;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Star rating input */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className={cn(
              "p-1 h-8 w-8",
              isLoading && "pointer-events-none opacity-50",
            )}
            onMouseEnter={() => isAuthenticated && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </Button>
        ))}
      </div>

      {/* Rating info */}
      <div className="text-sm text-muted-foreground">
        {avgRating > 0 ? (
          <span>
            <span className="font-medium text-foreground">
              {avgRating.toFixed(1)}
            </span>
            /5 ({ratingCount} đánh giá)
          </span>
        ) : (
          <span>Chưa có đánh giá</span>
        )}
      </div>

      {/* User's rating */}
      {myRating && (
        <p className="text-xs text-primary">Đánh giá của bạn: {myRating} ⭐</p>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <p className="text-xs text-muted-foreground">Đăng nhập để đánh giá</p>
      )}
    </div>
  );
}
