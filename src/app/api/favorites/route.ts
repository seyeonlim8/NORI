import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserFromRequest } from "../../../../lib/auth";

// Get user's favorite words
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favoriteWord.findMany({
    where: { userId: user.id },
    select: { wordId: true },
  });

  return NextResponse.json(favorites.map((f) => f.wordId));
}

// Add/Remove favorite word
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { wordId } = await req.json();
  const existing = await prisma.favoriteWord.findUnique({
    where: { userId_wordId: { userId: user.id, wordId } },
  });

  if (existing) {
    await prisma.favoriteWord.delete({
      where: { userId_wordId: { userId: user.id, wordId } },
    });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favoriteWord.create({
      data: { userId: user.id, wordId },
    });
    return NextResponse.json({ favorited: true });
  }
}
