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

  try {
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
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "flashcard";
  const level = url.searchParams.get("level");
  const wordId = url.searchParams.get("wordId");

  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    // Check if wordId is provided to get specific word's progress
    if (wordId) {
      if (!level) {
        return NextResponse.json(
          { error: "Level is required" },
          { status: 400 }
        );
      }

      // Convert wordId to a number
      const parsedWordId = parseInt(wordId, 10);
      if (isNaN(parsedWordId)) {
        return NextResponse.json({ error: "Invalid wordId" }, { status: 400 });
      }

      const progress = await prisma.studyProgress.findUnique({
        where: {
          userId_type_level_wordId: {
            userId,
            type,
            level,
            wordId: parsedWordId,
          },
        },
      });

      return NextResponse.json({ completed: progress?.completed ?? false });
    }

    // If no wordId, return all progress for the user
    const progressList = await prisma.studyProgress.findMany({
      where: {
        userId,
        type,
        ...(level ? { level } : {}),
      },
    });

    return NextResponse.json(progressList);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
