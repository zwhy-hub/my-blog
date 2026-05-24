import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId, approved: true, parentId: null },
    include: {
      replies: {
        where: { approved: true },
        include: {
          replies: {
            where: { approved: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { content, authorName, authorEmail, postId, parentId } = body;

  if (!content?.trim() || !authorName?.trim() || !postId) {
    return NextResponse.json(
      { error: "content, authorName, and postId are required" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail?.trim() || "",
      postId,
      parentId: parentId || null,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
