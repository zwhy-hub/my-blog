import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/post-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
  if (!tag) return { title: "标签未找到" };
  return { title: `标签: ${tag.name}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: tagSlug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug: tagSlug },
    include: {
      posts: {
        where: { published: true },
        include: { tags: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link
        href="/tags"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        所有标签
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        标签: {tag.name}
      </h1>
      <p className="text-muted-foreground mb-8">
        共 {tag.posts.length} 篇文章
      </p>

      <div className="divide-y">
        {tag.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
