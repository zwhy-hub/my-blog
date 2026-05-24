"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  approved: boolean;
  createdAt: string;
  post: { title: string };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    const res = await fetch("/api/admin/comments");
    if (res.ok) setComments(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchComments();
  }, []);

  async function handleApprove(id: string) {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });

    if (res.ok) {
      toast.success("评论已审核通过");
      fetchComments();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这条评论吗？")) return;

    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("评论已删除");
      fetchComments();
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">评论管理</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>评论内容</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>文章</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                暂无评论
              </TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">{comment.authorName}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.authorEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[120px] truncate text-muted-foreground">
                  {comment.post.title}
                </TableCell>
                <TableCell>
                  <Badge variant={comment.approved ? "default" : "secondary"}>
                    {comment.approved ? "已通过" : "待审核"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {!comment.approved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={() => handleApprove(comment.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
