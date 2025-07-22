"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Check if user is logged in
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user", {
        credentials: "include", // 이거 안 넣으면 쿠키가 안 가서 무조건 401 됨
      });
      if (!res.ok) {
        router.push(`/login?redirect=${window.location.pathname}`);
      }
    };
    checkAuth();
  }, [router]);

  // Get user's progress
  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(
        `/api/study-progress?type=flashcard&level=${level}`,
        {
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();

        // wordId 별로 completed 저장
        const mapped: Record<number, boolean> = {};
        data.forEach((p: any) => {
          mapped[p.wordId] = p.completed;
        });
        setProgress(mapped);

        // lastSeen이 가장 최근인 row의 currentIndex를 복원
        if (data.length > 0) {
          const lastSeenRow = data.reduce((latest: any, cur: any) =>
            new Date(cur.lastSeen) > new Date(latest.lastSeen) ? cur : latest
          );
          setCurrentIndex(lastSeenRow.currentIndex ?? 0); // 없으면 0으로 설정
        }
      }
    };
    fetchProgress();
  }, [level]);

  // Get words of specific level
  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      const res = await fetch(`/api/words?level=${level}`);
      const data = await res.json();
      setCards(data);
      setTotalCount(data.length);
      setLoading(false);
    };
    loadWords();
  }, [level]);

  // Handle O/X
  const handleMark = async (type: "remembered" | "needsReview") => {
    const currentWord = cards[currentIndex];
    const completed = type === "remembered";
    const nextIndex = currentIndex + 1;

    await fetch("/api/study-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        wordId: currentWord.id,
        completed,
        currentIndex: nextIndex >= cards.length ? 0 : nextIndex,
        type: "flashcard",
        level,
      }),
    });

    setProgress((prev) => ({ ...prev, [currentWord.id]: completed }));

    if (nextIndex >= cards.length) {
      const unlearned = cards.filter(
        (c) => !progress[c.id] && c.id !== currentWord.id
      );
      if (!completed) unlearned.push(currentWord);

      if (unlearned.length > 0) {
        if (confirm(`${unlearned.length} words still need review. Continue?`)) {
          setCards(unlearned);
          setCurrentIndex(0);
          setReviewMode(true);
          return;
        }
      }

      // Reset progress after going through all flashcards
      await fetch(`/api/study-progress/reset?type=flashcard&level=${level}`, {
        method: "POST",
        credentials: "include",
      });
      setProgress({});
      setReviewMode(false);
      alert("You studied all the flashcards! Progress has been reset.");
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const completedCount = Object.values(progress).filter((p) => p).length;
  const progressText = `${completedCount} / ${totalCount || cards.length}`;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Get user's favorite words
  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavoritedIds(data);
      }
    };
    fetchFavorites();
  }, []);

  // Toggle favorite words
  const toggleFavorite = async () => {
    const wordId = cards[currentIndex].id;
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId }),
    });
    const result = await res.json();

    setFavoritedIds(
      (prev) =>
        result.favorited
          ? [...prev, wordId] // add wordId to favorite words array
          : prev.filter((id) => id !== wordId) // create a new favorite words array, excluding wordId
    );
  };

  if (loading) return <div className="text-center mt-40">Loading...</div>;
  if (cards.length === 0)
    return <div className="text-center mt-40">No words to load.</div>;

  const card = cards[currentIndex];

  // Get english meaning (WILL BE EDITED)
  const englishMeaning = card.meanings.find((m) => m.language_code === "en");

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
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
            <p
              className="mt-1 font-bold font-outfit text-sm"
              style={{ color: "#503b3dff" }}
            >
              {progressText} {reviewMode && "(Review Mode)"}
            </p>
          </div>

          {/* Card & Button */}
          <div className="flex items-center justify-center gap-6 w-full">
            {/* X button */}
            <button
              onClick={() => handleMark("needsReview")}
              className="w-16 aspect-square bg-orange-50 rounded-full shadow-md flex items-center justify-center p-0 transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <span className="text-3xl font-bold text-red-400">X</span>
            </button>

            {/* Card */}
            <div className="relative bg-orange-50 rounded-[24px] shadow-lg px-8 py-10 min-h-[400px] flex flex-col items-center justify-center gap-4 w-full max-w-[600px]">
              {/* Favorite */}
              <div
                className="absolute top-4 right-4 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
                onClick={toggleFavorite}
              >
                {favoritedIds.includes(card.id) ? (
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
                  {showMeaning && englishMeaning?.example_sentence_meaning && (
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
