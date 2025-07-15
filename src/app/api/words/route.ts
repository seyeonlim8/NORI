import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// Filter words by level
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");

  const words = await prisma.word.findMany({
    where: level ? { level } : undefined,
    include: {
      meanings: true,
    },
  });

  return NextResponse.json(words);
}
