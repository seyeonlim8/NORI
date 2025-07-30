import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

// Get user's favorite words
export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };

  const favorites = await prisma.favoriteWord.findMany({
    where: { userId },
    include: {
      word: { include: { meanings: true } }, 
    },
  });

  const words = favorites.map((fav) => fav.word);
  return NextResponse.json(words);
}

// Add/Remove favorite word
export async function POST(req: NextRequest) {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };
  const { wordId } = await req.json();

  const existing = await prisma.favoriteWord.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });

  if (existing) {
    await prisma.favoriteWord.delete({
      where: { userId_wordId: { userId, wordId } },
    });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favoriteWord.create({ data: { userId, wordId } });
    return NextResponse.json({ favorited: true });
  }
}
