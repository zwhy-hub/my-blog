import { PostEditor } from "@/components/editor/post-editor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新建文章</h1>
      <PostEditor />
    </div>
  );
}
