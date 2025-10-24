"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

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
  const [favoritedWords, setFavoritedWords] = useState<Word[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();

  // Check login
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user", { credentials: "include" });
      if (!res.ok) router.push(`/login?redirect=${window.location.pathname}`);
    };
    checkAuth();
  }, [router]);

  // Get favorite words or words of specific level
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (level === "favorites") {
        const res = await fetch("/api/favorites", { credentials: "include" });
        if (res.status === 401) {
          // Redirect to login page if token expired
          router.push(`/login?redirect=${window.location.pathname}`);
          return;
        }

        const data = await res.json();
        setCards(data);
        setFavoritedWords(data);
        setTotalCount(data.length);
        setLoading(false);
      } else {
        const res = await fetch(`/api/words?level=${level}`);
        const data = await res.json();
        setCards(data);
        setTotalCount(data.length);
        setLoading(false);
      }
    };

    loadData();
  }, [level, router]);

  // Get study progress - exclude favorites
  useEffect(() => {
    if (level === "favorites") return;

    const fetchProgress = async () => {
      const res = await fetch(
        `/api/study-progress?type=flashcard&level=${level}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        const mapped: Record<number, boolean> = {};
        data.forEach((p: any) => (mapped[p.wordId] = p.completed));
        setProgress(mapped);

        if (data.length > 0) {
          const lastSeenRow = data.reduce((latest: any, cur: any) =>
            new Date(cur.lastSeen) > new Date(latest.lastSeen) ? cur : latest
          );
          setCurrentIndex(lastSeenRow.currentIndex ?? 0);
        }
      }
    };

    fetchProgress();
  }, [level]);

  // Toggle favorites
  const toggleFavorite = async () => {
    const word = cards[currentIndex];
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ wordId: word.id }),
    });
    const result = await res.json();

    setFavoritedWords((prev) => {
      if (result.favorited) {
        return prev.some((w) => w.id === word.id) ? prev : [...prev, word];
      } else {
        return prev.filter((w) => w.id !== word.id);
      }
    });

    if (!result.favorited && level === "favorites") {
      setCards((prev) => prev.filter((w) => w.id !== word.id));
      setCurrentIndex((prev) => (prev >= cards.length - 1 ? 0 : prev));
    }
  };

  // Update study progress - except favorites
  const handleMark = async (type: "remembered" | "needsReview") => {
    if (level === "favorites") {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      return;
    }

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

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) return <div className="text-center mt-40">Loading...</div>;
  if (cards.length === 0)
    return <div className="text-center mt-40">No words to load.</div>;

  const card = cards[currentIndex];
  const isFavorited = favoritedWords.some((w) => w.id === card.id);
  const englishMeaning = card.meanings.find((m) => m.language_code === "en");

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col items-center overflow-hidden">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-12 pb-5 flex flex-col flex-grow justify-start items-center gap-10 mx-auto"
      >
        {level !== "favorites" && (
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
            <p className="mt-1 font-bold font-outfit text-sm text-gray-700">
              {completedCount} / {totalCount} {reviewMode && "(Review Mode)"}
            </p>
          </div>
        )}

        {/* Card & Buttons */}
        <div
          data-testid="flashcard-container"
          className="flex items-center justify-center gap-6 w-full"
        >
          {/* X button */}
          <button
            data-testid="x-btn"
            onClick={() => handleMark("needsReview")}
            className="w-16 aspect-square bg-orange-50 rounded-full shadow-md flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-90"
          >
            <span className="text-3xl font-bold text-red-400">X</span>
          </button>

          <div className="relative bg-orange-50 rounded-[24px] shadow-lg px-8 py-10 min-h-[400px] flex flex-col items-center justify-center gap-4 w-full max-w-[600px]">
            {/* Favorite button */}
            <div
              data-testid="favorite-btn"
              className="absolute top-4 right-4 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
              onClick={toggleFavorite}
            >
              {isFavorited ? (
                <span className="text-orange-300 text-4xl">★</span>
              ) : (
                <span className="text-gray-300 text-4xl">☆</span>
              )}
            </div>

            {/* Card */}
            {showMeaning && (
              <div
                data-testid="furigana"
                className="text-lg text-rose-400 font-noto-sans-jp -mt-2"
              >
                {card.furigana}
              </div>
            )}
            <div
              data-testid="vocabulary"
              data-word-id={card.id}
              className="text-5xl font-bold font-noto-sans-jp"
            >
              {card.kanji}
            </div>
            {showMeaning && (
              <div className="text-center text-lg text-rose-400 font-outfit">
                {englishMeaning?.word_meaning ?? ""}
              </div>
            )}
            {showExample && (
              <div className="text-center text-xl text-gray-600 font-noto-sans-jp">
                {card.example_sentence}
                {showMeaning && englishMeaning?.example_sentence_meaning && (
                  <>
                    <br />
                    <span className="text-gray-400 text-base font-outfit">
                      {englishMeaning.example_sentence_meaning}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* O button */}
          <button
            data-testid="o-btn"
            onClick={() => handleMark("remembered")}
            className="w-16 aspect-square bg-orange-50 rounded-full shadow-md flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-90"
          >
            <span className="text-3xl font-bold text-blue-400">O</span>
          </button>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-4 mt-4">
          <button
            data-testid="example-btn"
            onClick={() => setShowExample((prev) => !prev)}
            className="px-4 py-2 rounded text-white font-bold font-outfit text-sm transition-transform duration-200 hover:scale-110 active:scale-90"
            style={{ backgroundColor: "#F27D88" }}
          >
            {showExample ? "Hide example sentence" : "See example sentence"}
          </button>
          <button
            data-testid="meaning-btn"
            onClick={() => setShowMeaning((prev) => !prev)}
            className="px-4 py-2 rounded bg-orange-300 text-white font-bold font-outfit text-sm transition-transform duration-200 hover:scale-110 active:scale-90"
          >
            {showMeaning ? "Hide meaning" : "Show meaning"}
          </button>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
