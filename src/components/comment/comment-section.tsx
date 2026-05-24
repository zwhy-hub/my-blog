"use client";

import { useCallback, useEffect, useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  replies: Comment[];
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <MessageSquare className="h-5 w-5" />
        评论
      </h2>
      <Separator className="my-4" />
      <CommentForm postId={postId} onSuccess={fetchComments} />
      <div className="mt-8">
        <CommentList postId={postId} comments={comments} onRefresh={fetchComments} />
      </div>
    </section>
  );
}
