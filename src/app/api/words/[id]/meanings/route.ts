import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const meanings = Array.isArray(body?.meanings) ? body.meanings : null;
    if (!meanings) {
      return NextResponse.json(
        { success: false, message: "meanings must be an array" },
        { status: 400 }
      );
    }
    const wordId = parseInt(context.params.id);
    if (Number.isNaN(wordId)) {
      return NextResponse.json(
        { success: false, message: "Invalid word id" },
        { status: 400 }
      );
    }

    // 1. Delete original WordMeaning[] data
    await prisma.wordMeaning.deleteMany({
      where: { wordId },
    });

    // 2. Add new meanings
    const created = await prisma.wordMeaning.createMany({
      data: meanings.map(
        (m: {
          language_code: string;
          word_meaning: string;
          example_sentence_meaning: string;
        }) => ({
          language_code: m.language_code,
          word_meaning: m.word_meaning,
          example_sentence_meaning: m.example_sentence_meaning,
          wordId,
        })
      ),
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
