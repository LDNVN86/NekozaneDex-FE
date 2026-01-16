"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import {
  replyCommentAction,
  updateCommentAction,
  togglePinCommentAction,
  reportCommentAction,
} from "../actions/comment-actions";
import { useLikeComment } from "../hooks/useLikeComment";
import type { Comment } from "../server";
import {
  CommentActionBar,
  CommentAvatar,
  CommentBubbleHeader,
  CommentContent,
  CommentReplies,
  ReplyForm,
  ReportDialog,
} from "./comment-parts";

interface CommentItemProps {
  comment: Comment;
  storySlug: string;
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newComment: Comment) => void;
  isPending: boolean;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  storySlug,
  currentUserId,
  isAdmin,
  onDelete,
  onUpdate,
  isPending,
  isReply = false,
}: CommentItemProps) {
  // Reply state
  const [showReplies, setShowReplies] = React.useState(false);
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState("");
  const [isReplying, startReplyTransition] = React.useTransition();

  // Report state
  const [isReporting, setIsReporting] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [isSubmittingReport, startReportTransition] = React.useTransition();

  // Edit state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(comment.content);
  const [isUpdating, startUpdateTransition] = React.useTransition();

  // Pin state
  const [isPinning, startPinTransition] = React.useTransition();

  // Like hook
  const { likeCount, isLiked, isLiking, handleLike } = useLikeComment({
    commentId: comment.id,
    initialLikeCount: comment.like_count || 0,
    initialIsLiked: comment.user_has_liked || false,
    currentUserId,
  });

  // Permissions
  const isOwner = currentUserId === comment.user_id;
  const canDelete = isOwner || !!isAdmin;
  const canEdit = isOwner;
  const canPin = !!isAdmin && !isReply;

  const userProfileUrl = comment.user?.tag_name
    ? `/client/users/${comment.user.tag_name}`
    : null;

  // Handlers
  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isReplying) return;

    startReplyTransition(async () => {
      const result = await replyCommentAction(
        comment.id,
        storySlug,
        replyContent,
      );
      if (result.success && result.reply) {
        setReplyContent("");
        setShowReplyForm(false);
        setShowReplies(true);
        toast.success("Đã trả lời");
        onUpdate(comment.id, {
          ...comment,
          replies: [...(comment.replies || []), result.reply],
        });
      } else {
        toast.error(result.error || "Không thể trả lời");
      }
    });
  };

  const handleSaveEdit = () => {
    if (!editContent.trim() || isUpdating) return;
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    startUpdateTransition(async () => {
      const result = await updateCommentAction(
        comment.id,
        storySlug,
        editContent.trim(),
      );
      if (result.success && result.comment) {
        onUpdate(comment.id, result.comment);
        setIsEditing(false);
        toast.success("Đã cập nhật");
      } else {
        toast.error(result.error || "Không thể cập nhật");
      }
    });
  };

  const handlePin = () => {
    if (isPinning) return;
    startPinTransition(async () => {
      const result = await togglePinCommentAction(comment.id, storySlug);
      if (result.success) {
        toast.success(result.is_pinned ? "Đã ghim" : "Đã bỏ ghim");
        onUpdate(comment.id, { ...comment, is_pinned: result.is_pinned });
      } else {
        toast.error(result.error || "Lỗi");
      }
    });
  };

  const handleReport = () => {
    if (!reportReason.trim() || isSubmittingReport) return;
    startReportTransition(async () => {
      const result = await reportCommentAction(comment.id, reportReason.trim());
      if (result.success) {
        toast.success("Đã báo cáo");
        setIsReporting(false);
        setReportReason("");
      } else {
        toast.error(result.error || "Lỗi");
      }
    });
  };

  const handleReplyToggle = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) setReplyContent("");
  };

  return (
    <div className={cn("group", isReply && "pl-12 relative")}>
      {/* Thread line for replies */}
      {isReply && (
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50" />
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <CommentAvatar comment={comment} />

        {/* Content bubble */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 transition-colors",
              comment.is_pinned
                ? "bg-primary/10 ring-1 ring-primary/20"
                : "bg-muted/50 hover:bg-muted/70",
            )}
          >
            {/* Header */}
            <CommentBubbleHeader
              comment={comment}
              userProfileUrl={userProfileUrl}
            />

            {/* Content */}
            <CommentContent
              comment={comment}
              isEditing={isEditing}
              editContent={editContent}
              setEditContent={setEditContent}
              isUpdating={isUpdating}
              handleCancelEdit={() => setIsEditing(false)}
              handleSaveEdit={handleSaveEdit}
            />
          </div>

          {/* Actions row - FB style */}
          {!isEditing && (
            <CommentActionBar
              comment={comment}
              likeCount={likeCount}
              isLiked={isLiked}
              isLiking={isLiking}
              currentUserId={currentUserId}
              isOwner={isOwner}
              canEdit={canEdit}
              canDelete={canDelete}
              canPin={canPin}
              isReply={isReply}
              showReplyForm={showReplyForm}
              onLike={handleLike}
              onReplyToggle={handleReplyToggle}
              onEdit={() => setIsEditing(true)}
              onPin={handlePin}
              onReport={() => setIsReporting(true)}
              onDelete={() => onDelete(comment.id)}
            />
          )}

          {/* Reply form */}
          <ReplyForm
            showReplyForm={showReplyForm}
            setShowReplyForm={setShowReplyForm}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            isReplying={isReplying}
            handleReply={handleReply}
          />

          {/* Replies */}
          <CommentReplies
            comment={comment}
            showReplies={showReplies}
            setShowReplies={setShowReplies}
            renderReply={(reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                storySlug={storySlug}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={onDelete}
                onUpdate={onUpdate}
                isPending={isPending}
                isReply
              />
            )}
          />
        </div>
      </div>

      {/* Report dialog */}
      <ReportDialog
        isReporting={isReporting}
        setIsReporting={setIsReporting}
        reportReason={reportReason}
        setReportReason={setReportReason}
        isSubmittingReport={isSubmittingReport}
        handleReport={handleReport}
      />
    </div>
  );
}
