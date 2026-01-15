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
import type { Comment } from "../server";

// Sub-components
import { CommentHeader } from "./comment-parts/CommentHeader";
import { CommentActions } from "./comment-parts/CommentActions";
import { CommentContent } from "./comment-parts/CommentContent";
import { CommentFooter } from "./comment-parts/CommentFooter";
import { ReplyForm } from "./comment-parts/ReplyForm";
import { ReportDialog } from "./comment-parts/ReportDialog";

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
  const [showReplies, setShowReplies] = React.useState(false);
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState("");
  const [isReplying, startReplyTransition] = React.useTransition();

  const [isReporting, setIsReporting] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [isSubmittingReport, startReportTransition] = React.useTransition();

  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(comment.content);
  const [isUpdating, startUpdateTransition] = React.useTransition();

  const [likeCount, setLikeCount] = React.useState(comment.like_count || 0);
  const [isLiked, setIsLiked] = React.useState(comment.user_has_liked || false);
  const [isLiking, setIsLiking] = React.useState(false);

  const [isPinning, startPinTransition] = React.useTransition();

  const isOwner = currentUserId === comment.user_id;
  const canDelete = isOwner || !!isAdmin;
  const canEdit = isOwner;
  const canPin = !!isAdmin && !isReply;
  const hasReplies = !!(comment.replies && comment.replies.length > 0);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isReplying) return;

    startReplyTransition(async () => {
      const result = await replyCommentAction(
        comment.id,
        storySlug,
        replyContent
      );
      if (result.success && result.reply) {
        setReplyContent("");
        setShowReplyForm(false);
        setShowReplies(true);
        toast.success("Đã trả lời comment");
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
        editContent.trim()
      );
      if (result.success && result.comment) {
        onUpdate(comment.id, result.comment);
        setIsEditing(false);
        toast.success("Đã cập nhật comment");
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
        toast.success(
          result.is_pinned ? "Đã ghim bình luận" : "Đã bỏ ghim bình luận"
        );
        onUpdate(comment.id, { ...comment, is_pinned: result.is_pinned });
      } else {
        toast.error(result.error || "Không thể cập nhật trạng thái ghim");
      }
    });
  };

  const handleReport = () => {
    if (!reportReason.trim() || isSubmittingReport) return;
    startReportTransition(async () => {
      const result = await reportCommentAction(comment.id, reportReason.trim());
      if (result.success) {
        toast.success("Đã gửi báo cáo bình luận");
        setIsReporting(false);
        setReportReason("");
      } else {
        toast.error(result.error || "Không thể gửi báo cáo");
      }
    });
  };

  return (
    <div
      className={cn("group", isReply && "ml-8 border-l-2 border-muted pl-4")}
    >
      <div
        className={cn(
          "bg-card rounded-xl p-4 border transition-all",
          comment.is_pinned
            ? "border-primary/50 bg-primary/5"
            : "border-border/50"
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <CommentHeader comment={comment} />
          <CommentActions
            comment={comment}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            canEdit={canEdit}
            canDelete={canDelete}
            canPin={canPin}
            isEditing={isEditing}
            isPending={isPending}
            isPinning={isPinning}
            handlePin={handlePin}
            handleEdit={() => setIsEditing(true)}
            onDelete={onDelete}
            setIsReporting={setIsReporting}
            setShowReplyForm={setShowReplyForm}
            showReplyForm={showReplyForm}
            setReplyContent={setReplyContent}
          />
        </div>

        <CommentContent
          comment={comment}
          isEditing={isEditing}
          editContent={editContent}
          setEditContent={setEditContent}
          isUpdating={isUpdating}
          handleCancelEdit={() => setIsEditing(false)}
          handleSaveEdit={handleSaveEdit}
        />

        <CommentFooter
          comment={comment}
          currentUserId={currentUserId}
          isEditing={isEditing}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          likeCount={likeCount}
          setLikeCount={setLikeCount}
          isLiking={isLiking}
          setIsLiking={setIsLiking}
          showReplies={showReplies}
          setShowReplies={setShowReplies}
          hasReplies={hasReplies}
        />
      </div>

      <ReplyForm
        showReplyForm={showReplyForm}
        setShowReplyForm={setShowReplyForm}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        isReplying={isReplying}
        handleReply={handleReply}
      />

      {showReplies && hasReplies && (
        <div className="mt-3 space-y-3">
          {comment.replies!.map((reply) => (
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
          ))}
        </div>
      )}

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
