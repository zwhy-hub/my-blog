import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    createdAt: Date;
    viewCount: number;
    tags: { name: string; slug: string; color: string }[];
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border-b py-8 first:pt-0 last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="block">
        <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary/80 transition-colors">
          {post.title}
        </h2>
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {post.createdAt.toLocaleDateString("zh-CN")}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {post.viewCount}
        </span>
      </div>

      {post.excerpt && (
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge variant="secondary" className="text-xs hover:bg-secondary/80">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
