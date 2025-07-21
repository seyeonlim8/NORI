"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";

type Word = {
  id: number;
  level: string;
  kanji: string;
  furigana: string;
  example_sentence: string;
  answer_in_example: string;
  meanings: {
    language_code: string;
    word_meaning: string;
    example_sentence_meaning: string;
  }[];
};

export default function FlashcardsPage({ level }: { level: string }) {
  const [cards, setCards] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [favorited, setFavorited] = useState<number[]>([]);

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      const res = await fetch(`/api/words?level=${level}`);
      const data = await res.json();
      setCards(data);
      setLoading(false);
    };
    loadWords();
  }, [level]);

  const handleMark = (type: "remembered" | "needsReview") => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const toggleFavorite = () => {
    if (favorited.includes(currentIndex)) {
      setFavorited((prev) => prev.filter((i) => i !== currentIndex));
    } else {
      setFavorited((prev) => [...prev, currentIndex]);
    }
  };

  if (loading) return <div className="text-center mt-40">로딩 중...</div>;
  if (cards.length === 0)
    return <div className="text-center mt-40">단어가 없습니다.</div>;

  const card = cards[currentIndex];

  // Get english meaning (WILL BE EDITED)
  const englishMeaning = card.meanings.find((m) => m.language_code === "en");

  const progressText = `${currentIndex + 1} / ${cards.length}`;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col items-center overflow-hidden">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-12 pb-5 flex flex-col justify-start items-center gap-10 mx-auto"
      >
        <div className="mt-20 w-full max-w-[720px] flex flex-col items-center gap-6">
          {/* Progress bar */}
          <div className="w-full px-6 flex flex-col items-center">
            <div className="w-md bg-orange-50 rounded-full h-3 relative">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#F27D88",
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              />
            </div>
            <p
              className="mt-1 font-bold font-outfit text-sm"
              style={{ color: "#503b3dff" }}
            >
              {progressText}
            </p>
          </div>

          {/* 카드 & 버튼 */}
          <div className="flex items-center justify-center gap-6 w-full">
            {/* X button */}
            <button
              onClick={() => handleMark("needsReview")}
              className="w-16 aspect-square bg-orange-50 rounded-full shadow-md flex items-center justify-center p-0 transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <span className="text-3xl font-bold text-red-400">X</span>
            </button>

            {/* 카드 */}
            <div className="relative bg-orange-50 rounded-[24px] shadow-lg px-8 py-10 min-h-[400px] flex flex-col items-center justify-center gap-4 w-full max-w-[600px]">
              {/* Favorite */}
              <div
                className="absolute top-4 right-4 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
                onClick={toggleFavorite}
              >
                {favorited.includes(currentIndex) ? (
                  <span className="text-orange-300 text-4xl transition-colors duration-200">
                    ★
                  </span>
                ) : (
                  <span className="text-gray-300 text-4xl transition-colors duration-200">
                    ☆
                  </span>
                )}
              </div>

              {showMeaning && (
                <div className="text-lg text-rose-400 font-outfit -mt-2">
                  {card.furigana}
                </div>
              )}
              <div className="text-5xl font-bold font-outfit">{card.kanji}</div>
              {showMeaning && (
                <div className="text-center text-lg text-rose-400 font-outfit">
                  {englishMeaning?.word_meaning ?? ""}
                </div>
              )}
              {showExample && (
                <div className="text-center text-xl text-gray-600 font-outfit">
                  {card.example_sentence}
                  {showMeaning &&
                    englishMeaning?.example_sentence_meaning && (
                      <>
                        <br />
                        <span className="text-gray-400 text-base">
                          {englishMeaning.example_sentence_meaning}
                        </span>
                      </>
                    )}
                </div>
              )}
            </div>

            {/* O Button */}
            <button
              onClick={() => handleMark("remembered")}
              className="w-16 aspect-square bg-orange-50 rounded-full shadow-md flex items-center justify-center p-0 transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <span className="text-3xl font-bold text-blue-400">O</span>
            </button>
          </div>

          {/* Toggle buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setShowExample((prev) => !prev)}
              className="px-4 py-2 rounded text-white font-bold font-outfit text-sm transition-transform duration-200 hover:scale-110 active:scale-90"
              style={{ backgroundColor: "#F27D88" }}
            >
              {showExample ? "Hide example sentence" : "See example sentence"}
            </button>
            <button
              onClick={() => setShowMeaning((prev) => !prev)}
              className="px-4 py-2 rounded bg-orange-300 text-white font-bold font-outfit text-sm transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              {showMeaning ? "Hide meaning" : "Show meaning"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
