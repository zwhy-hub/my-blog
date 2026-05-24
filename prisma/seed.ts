import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashSync } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@blog.com",
      password: hashSync("admin123", 10),
      role: "admin",
    },
  });

  const tags = await Promise.all(
    [
      { name: "React", slug: "react", color: "#61dafb" },
      { name: "Next.js", slug: "nextjs", color: "#000000" },
      { name: "TypeScript", slug: "typescript", color: "#3178c6" },
      { name: "CSS", slug: "css", color: "#264de4" },
      { name: "JavaScript", slug: "javascript", color: "#f7df1e" },
    ].map((tag) =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      })
    )
  );

  await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "Hello World — 欢迎来到我的博客",
      slug: "hello-world",
      excerpt: "这是我的第一篇博客文章，介绍了这个博客的技术栈和功能特性。",
      content: `# Hello World

欢迎来到我的个人博客！这是用 **Next.js 15** + **Prisma** + **Tailwind CSS** 构建的现代化博客系统。

## 技术栈

- **Next.js 15** — React 全栈框架，App Router
- **Prisma** — 类型安全的 ORM
- **Tailwind CSS** — Utility-first CSS 框架
- **shadcn/ui** — 精美的 UI 组件库
- **NextAuth.js** — 身份认证

## 功能特性

1. 文章发布与管理
2. 标签分类系统
3. 评论互动
4. 暗色模式
5. 全文搜索

\`\`\`typescript
const greeting = "Hello, Blog!";
console.log(greeting);
\`\`\`

感谢访问，希望你喜欢这里的内容！`,
      published: true,
      authorId: admin.id,
      tags: { connect: [{ slug: "nextjs" }, { slug: "react" }, { slug: "typescript" }] },
    },
  });

  await prisma.post.upsert({
    where: { slug: "getting-started-with-nextjs" },
    update: {},
    create: {
      title: "Next.js 入门指南",
      slug: "getting-started-with-nextjs",
      excerpt: "从零开始学习 Next.js，了解 App Router、Server Components 和数据获取。",
      content: `# Next.js 入门指南

Next.js 是一个基于 React 的全栈框架，提供了服务端渲染、静态生成等强大功能。

## App Router

Next.js 13+ 引入了全新的 App Router，基于 React Server Components 构建。

### 文件系统路由

\`\`\`
app/
├── page.tsx          # /
├── about/
│   └── page.tsx      # /about
└── blog/
    └── [slug]/
        └── page.tsx  # /blog/:slug
\`\`\`

### Server Components

默认情况下，App Router 中的组件都是 Server Components：

\`\`\`tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{JSON.stringify(data)}</div>;
}
\`\`\`

## 数据获取

Next.js 支持多种数据获取方式，包括 SSR、SSG 和 ISR。

希望这篇指南对你有所帮助！`,
      published: true,
      authorId: admin.id,
      tags: { connect: [{ slug: "nextjs" }, { slug: "react" }] },
    },
  });

  await prisma.post.upsert({
    where: { slug: "typescript-tips" },
    update: {},
    create: {
      title: "TypeScript 实用技巧",
      slug: "typescript-tips",
      excerpt: "分享一些提高 TypeScript 开发效率的实用技巧和最佳实践。",
      content: `# TypeScript 实用技巧

TypeScript 为 JavaScript 添加了类型系统，让代码更安全、更易维护。

## 1. 类型推断

TypeScript 会自动推断变量类型：

\`\`\`typescript
const name = "Hello"; // string
const count = 42;      // number
const items = [1, 2];  // number[]
\`\`\`

## 2. 泛型

泛型让你编写可复用的类型安全代码：

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## 3. Utility Types

TypeScript 提供了许多实用类型：

\`\`\`typescript
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserName = Pick<User, 'name' | 'email'>;
\`\`\`

掌握这些技巧可以大幅提升开发体验！`,
      published: true,
      authorId: admin.id,
      tags: { connect: [{ slug: "typescript" }, { slug: "javascript" }] },
    },
  });

  console.log("Seed data created successfully!");
  console.log(`Admin user: admin@blog.com / admin123`);
  console.log(`Tags: ${tags.map((t) => t.name).join(", ")}`);
  console.log(`Posts: 3 articles created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
