import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const [postCount, commentCount, totalViews] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
  ]);

  const stats = [
    { label: "文章总数", value: postCount, icon: FileText },
    { label: "评论总数", value: commentCount, icon: MessageSquare },
    { label: "总浏览量", value: totalViews._sum.viewCount ?? 0, icon: Eye },
  ];

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, published: true, viewCount: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近文章</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium truncate max-w-xs">{post.title}</span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span
                    className={
                      post.published ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {post.published ? "已发布" : "草稿"}
                  </span>
                  <span>{post.viewCount} 浏览</span>
                  <span>{post.createdAt.toLocaleDateString("zh-CN")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
