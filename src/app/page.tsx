import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/post-card";
import type { Post, Tag } from "@/generated/prisma/client";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { tags: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">欢迎来到我的博客</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          分享技术、思考与生活
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">最新文章</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">暂无文章</p>
        ) : (
          <div className="divide-y">
            {posts.map((post: Post & { tags: Tag[] }) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
