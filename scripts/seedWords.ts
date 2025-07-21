import wordsData from "./words/n3.json";
import { prisma } from "../lib/prisma";

async function main() {
  for (const word of wordsData) {
    const {
      level,
      kanji,
      furigana,
      example_sentence,
      answer_in_example,
      meanings,
    } = word;

    const existingWord = await prisma.word.findFirst({
      where: { level, kanji },
    });
    if (existingWord) {
      console.log(`Skipping duplicate: ${level} ${kanji}`);
      continue;
    }

    // Create word
    await prisma.word.create({
      data: {
        level,
        kanji,
        furigana,
        example_sentence,
        answer_in_example,
        meanings: {
          create: meanings.map((m) => ({
            language_code: m.language_code,
            word_meaning: m.word_meaning,
            example_sentence_meaning: m.example_sentence_meaning,
          })),
        },
      },
    });

    console.log(`Inserted: ${level} ${kanji}`);
  }
}

main()
  .then(() => {
    console.log("✅ Word seeding complete");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    prisma.$disconnect;
  });
