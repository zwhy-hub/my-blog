import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    include: { tags: true, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, published, tagIds } = body;

  if (!title?.trim() || !slug?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "title, slug, and content are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt?.trim() || null,
      content: content.trim(),
      published: published ?? false,
      authorId: session.user!.id!,
      tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json(post, { status: 201 });
}
