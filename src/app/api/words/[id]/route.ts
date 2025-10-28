import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

/* api/words/[id] */

// Get word with specific id
export async function GET(_: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // await 필수
  const wordId = parseInt(id);
  const word = await prisma.word.findUnique({
    where: { id: wordId },
    include: { meanings: true },
  });

  if (!word) {
    return new NextResponse("Word not found", { status: 404 });
  }

  return NextResponse.json(word);
}

// Update the whole word
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const data = await request.json();
  const { id } = context.params;
  const wordId = parseInt(id);

  const updatedWord = await prisma.word.update({
    where: { id: wordId },
    data: {
      ...data,
      meanings: {
        deleteMany: {}, // Delete previous meanings data
        create: data.meanings, // Add meanings
      },
    },
    include: { meanings: true },
  });

  return NextResponse.json(updatedWord);
}

// Update specified fields only - Except 'meanings'
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const data = await request.json();
  const { id } = context.params;
  const wordId = parseInt(id);

  const updatedWord = await prisma.word.update({
    where: { id: wordId },
    data,
  });

  return NextResponse.json(updatedWord);
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const wordId = parseInt(id);
  const deletedWord = await prisma.word.delete({
    where: { id: wordId },
  });

  return NextResponse.json(deletedWord);
}
