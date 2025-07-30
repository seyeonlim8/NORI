import { prisma } from "../lib/prisma";
import updatedWords from "./words/n2_edited.json";

// Script to update '추후작업'
async function updateWords() {
  for (const word of updatedWords) {
    const existingWord = await prisma.word.findFirst({
      where: { level: word.level, kanji: word.kanji },
    });

    if (!existingWord) {
      console.log(`Skipping (not found): ${word.level} ${word.kanji}`);
      continue;
    }

    await prisma.word.update({
      where: { id: existingWord.id },
      data: {
        example_sentence: word.example_sentence,
        answer_in_example: word.answer_in_example,
        meanings: {
          deleteMany: {}, // delete original 'meanings'
          create: word.meanings.map((m) => ({
            language_code: m.language_code,
            word_meaning: m.word_meaning,
            example_sentence_meaning: m.example_sentence_meaning,
          })),
        },
      },
    });

    console.log(`Updated: ${word.level} ${word.kanji}`);
  }
}

updateWords()
  .then(() => {
    console.log("✅ Update complete");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
