import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const summary = searchParams.get("summary");

  // Return total number of words & that in in each level
  if (summary === "true") {
    const levels = ["N1", "N2", "N3", "N4", "N5"];

    const counts = await Promise.all(
      levels.map(async (lvl) => {
        const count = await prisma.word.count({ where: { level: lvl } });
        return { level: lvl, count };
      })
    );

    const total = counts.reduce((acc, cur) => acc + cur.count, 0);
    return NextResponse.json({ total, summary: counts });
  }

  // Return list of words
  const words = await prisma.word.findMany({
    where: level ? { level } : {},
    include: { meanings: true },
  });

  return NextResponse.json(words);
}
