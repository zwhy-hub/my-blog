"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentListProps {
  postId: string;
  comments: Comment[];
  onRefresh: () => void;
}

function CommentItem({
  comment,
  postId,
  depth,
  onRefresh,
}: {
  comment: Comment;
  postId: string;
  depth: number;
  onRefresh: () => void;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className={depth > 0 ? "ml-8 border-l pl-4" : ""}>
      <div className="flex gap-3 py-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {comment.authorName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{comment.content}</p>
          {depth < 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setReplying(!replying)}
            >
              <MessageSquare className="mr-1 h-3 w-3" />
              回复
            </Button>
          )}
        </div>
      </div>

      {replying && (
        <div className="ml-11 mb-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => {
              setReplying(false);
              onRefresh();
            }}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          depth={depth + 1}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export function CommentList({ postId, comments, onRefresh }: CommentListProps) {
  return (
    <div className="divide-y">
      {comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          暂无评论，来发表第一条评论吧
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            depth={0}
            onRefresh={onRefresh}
          />
        ))
      )}
    </div>
  );
}
