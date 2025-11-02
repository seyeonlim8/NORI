import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserId } from "@/lib/auth"; 

export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "flashcards";
  const level = url.searchParams.get("level");
  if (!level) {
    return NextResponse.json(
      { error: "Level is required" },
      { status: 400 }
    );
  }

  const session = await prisma.reviewSession.findUnique({
    where: { userId_type_level: { userId, type, level } },
  });

  return NextResponse.json(session ?? null);
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    type = "flashcards",
    level,
    wordIds,
    currentIndex = 0,
  } = await req.json();
  if (!level) {
    return NextResponse.json(
      { error: "Level is required" },
      { status: 400 }
    );
  }
  if (!Array.isArray(wordIds)) {
    return NextResponse.json(
      { error: "wordIds must be an array" },
      { status: 400 }
    );
  }

  try {
    const session = await prisma.reviewSession.upsert({
      where: { userId_type_level: { userId, type, level } },
      update: { wordIds, currentIndex },
      create: { userId, type, level, wordIds, currentIndex },
    });
    return NextResponse.json(session);
  } catch (error: any) {
    if (error?.code === "P2002") {
      const session = await prisma.reviewSession.update({
        where: { userId_type_level: { userId, type, level } },
        data: { wordIds, currentIndex },
      });
      return NextResponse.json(session);
    }
    throw error;
  }

}

export async function DELETE(req: Request) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "flashcards";
  const level = url.searchParams.get("level");
  if (!level) {
    return NextResponse.json(
      { error: "Level is required" },
      { status: 400 }
    );
  }

  await prisma.reviewSession.deleteMany({ where: { userId, type, level } });
  return NextResponse.json({ success: true });
}
