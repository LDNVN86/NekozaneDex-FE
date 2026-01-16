import * as React from "react";

interface UseLikeCommentOptions {
  commentId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  currentUserId?: string;
}

interface UseLikeCommentReturn {
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  handleLike: () => Promise<void>;
}

export function useLikeComment({
  commentId,
  initialLikeCount,
  initialIsLiked,
  currentUserId,
}: UseLikeCommentOptions): UseLikeCommentReturn {
  const [likeCount, setLikeCount] = React.useState(initialLikeCount);
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [isLiking, setIsLiking] = React.useState(false);

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch(`/api/proxy/comments/${commentId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  };

  return { likeCount, isLiked, isLiking, handleLike };
}
