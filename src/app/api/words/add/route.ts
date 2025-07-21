import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      level,
      kanji,
      furigana,
      example_sentence,
      answer_in_example,
      meanings,
    } = body;

    if (
      !level ||
      !kanji ||
      !furigana ||
      !example_sentence ||
      !answer_in_example ||
      !Array.isArray(meanings)
    ) {
      return NextResponse.json(
        { error: "⚠️ Missing required fields" },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findFirst({
      where: { level, kanji },
    });

    if (existingWord) {
      return NextResponse.json(
        { error: "⚠️ This word already exists in the database." },
        { status: 409 } // 409 Conflict
      );
    }

    const word = await prisma.word.create({
      data: {
        level,
        kanji,
        furigana,
        example_sentence,
        answer_in_example,
        meanings: {
          create: meanings.map((meaning: any) => ({
            language_code: meaning.language_code,
            word_meaning: meaning.word_meaning,
            example_sentence_meaning: meaning.example_sentence_meaning,
          })),
        },
      },
      include: { meanings: true },
    });

    return NextResponse.json({ success: true, word });
  } catch (err) {
    console.error("❌ Error adding word:", err);
    return NextResponse.json(
      { success: false, message: "Failed to add word" },
      { status: 500 }
    );
  }
}
