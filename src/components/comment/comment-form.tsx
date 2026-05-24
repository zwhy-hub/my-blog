"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ authorName: "", authorEmail: "", content: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim() || !form.authorName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, postId, parentId }),
      });

      if (!res.ok) throw new Error("提交失败");

      toast.success("评论提交成功，审核通过后将会显示");
      setForm({ authorName: "", authorEmail: "", content: "" });
      onSuccess?.();
    } catch {
      toast.error("评论提交失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">昵称 *</Label>
          <Input
            id="name"
            placeholder="你的昵称"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="你的邮箱（不会公开）"
            value={form.authorEmail}
            onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">评论内容 *</Label>
        <Textarea
          id="content"
          placeholder="写下你的评论..."
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : "提交评论"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </form>
  );
}
