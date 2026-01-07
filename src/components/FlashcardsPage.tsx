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
type StudyProgressRow = {
  wordId: number;
  completed: boolean;
  lastSeen: string | Date;
  currentIndex?: number | null;
};

const shuffle = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const BASE_SESSION_TYPE = "flashcards-base";

export default function FlashcardsPage({ level }: { level: string }) {
  const [cards, setCards] = useState<Word[]>([]);
  const [fullDeck, setFullDeck] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [favoritedWords, setFavoritedWords] = useState<Word[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();
  const persistBaseDeck = async (deckWords: Word[], currentIdx = 0) => {
    try {
      await fetch("/api/review-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: BASE_SESSION_TYPE,
          level,
          wordIds: deckWords.map((w) => w.id),
          currentIndex: currentIdx,
        }),
      });
    } catch (error) {
      console.error("Failed to persist base flashcards order", error);
    }
  };
const saveReviewSession = async (wordIds: number[], nextIndex: number) => {
  try {
    await fetch("/api/review-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        type: "flashcards",
        level,
        wordIds,
        currentIndex: nextIndex,
      }),
    });
  } catch (error) {
    console.error("Failed to persist review session", error);
  }
  };

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
        const shuffledFavorites = shuffle<Word>(data);
        setCards(shuffledFavorites);
        setFavoritedWords(shuffledFavorites);
        setTotalCount(shuffledFavorites.length);
        setLoading(false);
      } else {
        const res = await fetch(`/api/words?level=${level}`);
        const words: Word[] = await res.json();
        const wordMap = new Map(words.map((w) => [w.id, w]));
        let baseDeck: Word[] = [];
        let needsPersist = false;

        try {
          const baseSessionRes = await fetch(
            `/api/review-session?type=${BASE_SESSION_TYPE}&level=${level}`,
            { credentials: "include" }
          );
          if (baseSessionRes.ok) {
            const baseSession = await baseSessionRes.json();
            if (baseSession && Array.isArray(baseSession.wordIds)) {
              const baseSessionIds = baseSession.wordIds as number[];
              const ordered = baseSessionIds
                .map((id) => wordMap.get(id))
                .filter(Boolean) as Word[];
              const orderedIds = new Set(ordered.map((w) => w.id));
              const missing = words.filter((w) => !orderedIds.has(w.id));
              const combinedDeck = [...ordered, ...missing];
              if (combinedDeck.length === words.length) {
                baseDeck = combinedDeck;
                if (
                  missing.length > 0 ||
                  ordered.length !== baseSessionIds.length
                ) {
                  needsPersist = true;
                }
              }
            }
          }
        } catch (error) {
          console.error("Failed to load base flashcards order", error);
        }

        if (baseDeck.length === 0) {
          baseDeck = shuffle<Word>(words);
          needsPersist = true;
        }

        if (baseDeck.length !== words.length) {
          baseDeck = [...words];
          needsPersist = true;
        }

        if (needsPersist) {
          await persistBaseDeck(baseDeck, 0);
        }

        setFullDeck(baseDeck);

        // Try restoring a server-side review session
        const sessRes = await fetch(
          `/api/review-session?type=flashcards&level=${level}`,
          {
            credentials: "include",
          }
        );

        if (sessRes.ok) {
          const session = await sessRes.json();
          if (session && Array.isArray(session.wordIds)) {
            const dict = new Map(baseDeck.map((w) => [w.id, w]));
            const deck = (session.wordIds as number[])
              .map((id) => dict.get(id))
              .filter(Boolean) as Word[];
            if (deck.length > 0) {
              setCards(deck);
              setTotalCount(baseDeck.length);
              setReviewMode(true);
              const idx = typeof session.currentIndex === "number" ? session.currentIndex : 0;
              const resumeIndex = Math.min(Math.max(0, idx), deck.length - 1);
              setCurrentIndex(resumeIndex);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback to normal (not in review)
        setCards(baseDeck);
        setReviewMode(false);
        setTotalCount(baseDeck.length);
        setLoading(false);
      }
    };

    loadData();
  }, [level, router]);

  // Get study progress - exclude favorites
  useEffect(() => {
    if (level === "favorites" || loading) return;

    const fetchProgress = async () => {
      const res = await fetch(
        `/api/study-progress?type=flashcards&level=${level}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = (await res.json()) as StudyProgressRow[];
        const mapped: Record<number, boolean> = {};
        data.forEach((p) => (mapped[p.wordId] = p.completed));
        setProgress(mapped);

        if (!reviewMode && fullDeck.length > 0) {
          if (data.length > 0) {
            const lastSeenRow = data.reduce((latest, cur) =>
              new Date(cur.lastSeen) > new Date(latest.lastSeen) ? cur : latest
            );
            const resumeIndex = Math.min(
              lastSeenRow.currentIndex ?? 0,
              fullDeck.length - 1
            );
            setCurrentIndex(Math.max(0, resumeIndex));
          } else {
            const nextIndex = fullDeck.findIndex((w) => !mapped[w.id]);
            setCurrentIndex(nextIndex >= 0 ? nextIndex : 0);
          }
        }
      }
    };

    fetchProgress();
  }, [level, reviewMode, fullDeck, loading]);

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
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true); // Disable buttons

    try {
      if (cards.length === 0) return;

      if (level === "favorites") {
        setCurrentIndex((prev) => (cards.length > 0 ? (prev + 1) % cards.length : 0));
        return;
      }

      const currentWord = cards[currentIndex];
      if (!currentWord) return;

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
          type: "flashcards",
          level,
        }),
      });

      const updatedProgress = { ...progress, [currentWord.id]: completed };
      setProgress(updatedProgress);

      const deckWordIds = cards.map((w) => w.id);
      let canceledReviewPrompt = false;

      if (nextIndex >= cards.length) {
        const unlearned = cards.filter(
          (c) => !updatedProgress[c.id] && c.id !== currentWord.id
        );
        if (!completed) unlearned.push(currentWord);

        // When entering review mode
        if (unlearned.length > 0) {
          const proceed = confirm(
            `${unlearned.length} words still need review. Continue?\nIf you don't enter Review Mode now, your progress will be reset.`
          );
          if (proceed) {
            const randomizedReviewDeck = shuffle<Word>(unlearned);
            const reviewIds = randomizedReviewDeck.map((w) => w.id);
            setCards(randomizedReviewDeck);
            setCurrentIndex(0);
            setReviewMode(true);
            await saveReviewSession(reviewIds, 0);
            return;
          } else {
            canceledReviewPrompt = true;
          }
        }

        // On reset, clear the session
        await fetch(`/api/study-progress/reset?type=flashcards&level=${level}`, {
          method: "POST",
          credentials: "include",
        });
        await fetch(`/api/review-session?type=flashcards&level=${level}`, {
          method: "DELETE",
          credentials: "include",
        });

        setProgress({});
        setReviewMode(false);
        const reshuffledFullDeck = shuffle<Word>(fullDeck);
        setFullDeck(reshuffledFullDeck);
        setCards(reshuffledFullDeck);
        setTotalCount(reshuffledFullDeck.length);
        setCurrentIndex(0);
        await persistBaseDeck(reshuffledFullDeck, 0);
        if (canceledReviewPrompt) {
          router.push("/study/flashcards");
          return;
        }
        alert("You studied all the flashcards! Progress has been reset.");
      } else {
        setCurrentIndex(nextIndex);
        if (reviewMode) {
          await saveReviewSession(deckWordIds, nextIndex);
        }
      }
    } catch (error) {
      console.error("Failed to update study progress", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const reviewCompletedCount = reviewMode
    ? cards.reduce((acc, w) => acc + (progress[w.id] ? 1 : 0), 0)
    : 0;
  const reviewProgressPercentage =
    reviewMode && cards.length > 0
      ? (reviewCompletedCount / cards.length) * 100
      : 0;
  const studyProgressPercentage =
    !reviewMode && totalCount > 0
      ? (completedCount / totalCount) * 100
      : 0;
  const progressPercentage = reviewMode
    ? reviewProgressPercentage
    : studyProgressPercentage;

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
            <p
              data-testid="progress-counter"
              className="mt-1 font-bold font-outfit text-sm text-gray-700"
            >
              {reviewMode
                ? `${reviewCompletedCount} / ${cards.length} (Review Mode)`
                : `${completedCount} / ${totalCount}`}
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
            disabled={isProcessing}
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
            disabled={isProcessing}
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
