import { prisma } from "../../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { meanings } = await request.json();
    const wordId = parseInt(params.id);

    // 1. Delete original WordMeaning[] data
    await prisma.wordMeaning.deleteMany({
      where: { wordId },
    });

    // 2. Add new meanings
    const created = await prisma.wordMeaning.createMany({
      data: meanings.map((m: any) => ({
        ...m,
        wordId,
      })),
    });

    return NextResponse.json({
      success: true,
      createdCount: created.count,
    });
  } catch (err) {
    console.error("❌ Meanings PATCH Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update meanings" },
      { status: 500 }
    );
  }
}
