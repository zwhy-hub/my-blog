"use client";

import { use } from "react";
import { PostEditor } from "@/components/editor/post-editor";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <PostEditor postId={id} />
    </div>
  );
}
