import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/post-card";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import type { Post, Tag } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "搜索",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let posts: (Post & { tags: Tag[] })[] = [];

  if (query) {
    posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Search className="h-7 w-7" />
          搜索
        </h1>
        {query && (
          <p className="mt-2 text-muted-foreground">
            &ldquo;{query}&rdquo; 的搜索结果 — 共 {posts.length} 篇文章
          </p>
        )}
      </div>

      {!query ? (
        <p className="text-muted-foreground">请在顶部搜索栏输入关键词</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">未找到相关文章</p>
      ) : (
        <div className="divide-y">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
