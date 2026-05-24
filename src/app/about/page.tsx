import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">关于</h1>
      <Separator className="my-6" />

      <div className="prose max-w-none">
        <p>
          你好！欢迎来到我的个人博客。
        </p>
        <p>
          这个博客使用 <strong>Next.js 15</strong>、<strong>Prisma</strong>、
          <strong>Tailwind CSS</strong> 和 <strong>shadcn/ui</strong> 构建，
          部署在 <strong>Vercel</strong> 上。
        </p>
        <h2>关于我</h2>
        <p>
          我是一名开发者，热爱编程和技术分享。在这里，我会记录自己的学习笔记、
          技术实践和一些有趣的想法。
        </p>
        <h2>联系方式</h2>
        <ul>
          <li>GitHub: <a href="https://github.com">github.com</a></li>
          <li>Email: hello@example.com</li>
        </ul>
      </div>
    </div>
  );
}
