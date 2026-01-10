"use client";

import * as React from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export function CommentSection() {
  const [comment, setComment] = React.useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;
    // TODO: Implement comment submission
    console.log("Submit comment:", comment);
    setComment("");
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-bold">Bình luận</h2>
      </div>

      {/* Comment Form */}
      <div className="flex gap-4 mb-8">
        <Avatar className="shrink-0">
          <AvatarImage src="/diverse-user-avatars.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Viết bình luận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button onClick={handleSubmit} disabled={!comment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Gửi bình luận
          </Button>
        </div>
      </div>

      {/* Comment List - Placeholder */}
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
      </div>
    </section>
  );
}
