import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "flashcards";
  const level = url.searchParams.get("level") || "";

  await prisma.studyProgress.deleteMany({
    where: { userId, type, level },
  });

  await prisma.reviewSession.deleteMany({
    where: { userId, type, level },
  });

  await prisma.reviewSession.deleteMany({
    where: { userId, type: `${type}-base`, level },
  });

  return NextResponse.json({ success: true });
}
