import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const summary = searchParams.get("summary");

  // Return total number of words & that in in each level
  if (summary === "true") {
    const levels = ["N1", "N2", "N3", "N4", "N5"];

    const grouped = await prisma.word.groupBy({
      by: ["level"],
      _count: { level: true },
    });
    const countsByLevel = grouped.reduce<Record<string, number>>((acc, row) => {
      const key = row.level.toUpperCase();
      acc[key] = (acc[key] ?? 0) + row._count.level;
      return acc;
    }, {});
    const counts = levels.map((lvl) => ({
      level: lvl,
      count: countsByLevel[lvl] ?? 0,
    }));

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
