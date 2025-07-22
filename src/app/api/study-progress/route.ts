import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const {
    wordId,
    completed,
    currentIndex,
    type = "flashcard",
    level,
  } = await req.json();

  if (!level) {
    return NextResponse.json({ error: "Level is required" }, { status: 400 });
  }

  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };

  await prisma.studyProgress.upsert({
    where: {
      userId_type_level_wordId: { userId, type, level, wordId },
    },
    update: { completed, currentIndex, lastSeen: new Date() },
    create: { userId, wordId, type, level, completed, currentIndex },
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "flashcard";
  const level = url.searchParams.get("level");

  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json([], { status: 200 });

  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };

  const progress = await prisma.studyProgress.findMany({
    where: {
      userId,
      type,
      ...(level ? { level } : {}),
    },
  });

  return NextResponse.json(progress);
}
