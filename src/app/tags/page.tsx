import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览博客文章",
};

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">标签</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link key={tag.slug} href={`/tags/${tag.slug}`}>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              {tag.name}
              <span className="ml-2 text-muted-foreground">
                ({tag._count.posts})
              </span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
