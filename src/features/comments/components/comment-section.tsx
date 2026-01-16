"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  createCommentAction,
  deleteCommentAction,
  loadMoreCommentsAction,
} from "../actions/comment-actions";
import { useRealtimeComments } from "../hooks/useRealtimeComments";
import { CommentItem } from "./comment-item";
import {
  CommentForm,
  CommentFormGuest,
  CommentSkeleton,
  Pagination,
} from "./comment-parts";
import type { Comment } from "../server";

interface CommentSectionProps {
  storyId: string;
  storySlug: string;
  comments: Comment[];
  currentUserId?: string;
  isAdmin?: boolean;
  totalComments?: number;
  totalPages?: number;
}

const COMMENTS_PER_PAGE = 10;

export function CommentSection({
  storyId,
  storySlug,
  comments,
  currentUserId,
  isAdmin = false,
  totalComments = 0,
  totalPages = 1,
}: CommentSectionProps) {
  const [localComments, setLocalComments] = React.useState(comments);
  const [newComment, setNewComment] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pages, setPages] = React.useState(totalPages);
  const [isLoadingPage, setIsLoadingPage] = React.useState(false);

  // Realtime updates
  const { processedIdsRef } = useRealtimeComments({
    storyId,
    currentUserId,
    setLocalComments,
  });

  // Pagination handler
  const goToPage = async (page: number) => {
    if (page < 1 || page > pages || page === currentPage || isLoadingPage)
      return;

    setIsLoadingPage(true);
    const result = await loadMoreCommentsAction(
      storyId,
      page,
      COMMENTS_PER_PAGE,
    );

    if (result.success && result.comments) {
      setLocalComments(result.comments);
      setCurrentPage(page);
      if (result.totalPages) setPages(result.totalPages);
    } else {
      toast.error(result.error || "Không thể tải bình luận");
    }
    setIsLoadingPage(false);
  };

  // Submit new comment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPending) return;

    const content = newComment;
    setNewComment("");

    startTransition(async () => {
      const result = await createCommentAction(storyId, storySlug, content);
      if (!result.success) {
        setNewComment(content);
        toast.error(result.error || "Không thể đăng comment");
      } else {
        if (result.comment) {
          processedIdsRef.current.add(result.comment.id);
          setLocalComments((prev) => [result.comment!, ...prev]);
        }
        toast.success("Đã đăng comment");
      }
    });
  };

  // Delete comment
  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId, storySlug);
      if (!result.success) {
        toast.error(result.error || "Không thể xóa comment");
      } else {
        setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Đã xóa comment");
      }
    });
  };

  // Update comment (for edits, pins, replies)
  const handleUpdateComment = (id: string, updatedComment: Comment) => {
    setLocalComments((prev) => {
      const updated = prev.map((c) => (c.id === id ? updatedComment : c));
      return [...updated].sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    });
  };

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">
          Bình luận ({localComments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {currentUserId ? (
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          isPending={isPending}
          onSubmit={handleSubmit}
        />
      ) : (
        <CommentFormGuest />
      )}

      {/* Comments List */}
      {localComments.length === 0 && !isLoadingPage ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có bình luận nào</p>
          <p className="text-sm">Hãy là người đầu tiên bình luận!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoadingPage ? (
            <CommentSkeleton count={COMMENTS_PER_PAGE} />
          ) : (
            localComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                storySlug={storySlug}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onUpdate={handleUpdateComment}
                isPending={isPending}
              />
            ))
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pages}
            isLoading={isLoadingPage}
            onPageChange={goToPage}
          />
        </div>
      )}
    </section>
  );
}
