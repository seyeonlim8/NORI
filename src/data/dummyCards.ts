export type Flashcard = {
  id: string;
  kanji: string;
  furigana: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  level: "N3" | "N2" | "N1";
};

export const dummyCards: Flashcard[] = [
  {
    id: "1",
    kanji: "日本語",
    furigana: "にほんご",
    meaning: "Japanese language",
    example: "私は日本語を勉強しています。",
    exampleTranslation: "I am studying Japanese.",
    level: "N3",
  },
  {
    id: "2",
    kanji: "学生",
    furigana: "がくせい",
    meaning: "Student",
    example: "彼は大学の学生です。",
    exampleTranslation: "He is a university student.",
    level: "N3",
  },
  {
    id: "3",
    kanji: "勉強",
    furigana: "べんきょう",
    meaning: "study",
    example: "毎日日本語を勉強しています。",
    exampleTranslation: "I study Japanese every day.",
    level: "N2",
  },
  {
    id: "4",
    kanji: "経験",
    furigana: "けいけん",
    meaning: "experience",
    example: "彼は豊富な経験を持っている。",
    exampleTranslation: "He has a wealth of experience.",
    level: "N2",
  },
];
