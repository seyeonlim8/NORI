"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "./Header";
import Footer from "./Footer";

type Word = {
  id: number;
  level: string;
  example_sentence: string;
  answer_in_example: string;
  meanings: {
    language_code: string;
    example_sentence_meaning: string;
  }[];
};

const shuffle = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function FillInTheBlankPage({ level }: { level: string }) {
  const [deck, setDeck] = useState<Word[]>([]);
  const [fullDeck, setFullDeck] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const confettiFired = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user", { credentials: "include" });
      if (!res.ok) window.location.href = "/login?redirect=/study/fill";
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/words?level=${level}`);
        const data: Word[] = await res.json();
        const shuffled = shuffle<Word>(data);
        setFullDeck(shuffled);

        const sessRes = await fetch(
          `/api/review-session?type=fill&level=${level}`,
          { credentials: "include" }
        );

        if (sessRes.ok) {
          const session = await sessRes.json();
          if (session && Array.isArray(session.wordIds)) {
            const dict = new Map(shuffled.map((w) => [w.id, w]));
            const sessionDeck = (session.wordIds as number[])
              .map((id) => dict.get(id))
              .filter(Boolean) as Word[];
            if (sessionDeck.length > 0) {
              setDeck(sessionDeck);
              setTotalCount(shuffled.length);
              setReviewMode(true);
              setCurrentIndex(
                Math.min(session.currentIndex ?? 0, sessionDeck.length - 1)
              );
              setUserAnswer("");
              setFeedback(null);
              setLoading(false);
              return;
            }
          }
        }

        setDeck(shuffled);
        setReviewMode(false);
        setTotalCount(shuffled.length);
        setCurrentIndex(0);
        setUserAnswer("");
        setFeedback(null);
      } catch (error) {
        console.error("Failed to load fill-in-the-blank deck", error);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [level]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(`/api/study-progress?type=fill&level=${level}`, {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();
      const mapped: Record<number, boolean> = {};
      data.forEach((p: any) => (mapped[p.wordId] = p.completed));
      setProgress(mapped);

      if (!reviewMode && fullDeck.length > 0) {
        const nextIndex = fullDeck.findIndex((w) => !mapped[w.id]);
        setCurrentIndex(nextIndex >= 0 ? nextIndex : 0);
      }
    };

    fetchProgress();
  }, [level, reviewMode, fullDeck]);

  const reviewProgressPercentage =
    reviewMode && deck.length > 0
      ? (currentIndex / deck.length) * 100
      : 0;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const studyProgressPercentage =
    !reviewMode && totalCount > 0
      ? (completedCount / totalCount) * 100
      : 0;
  const progressPercentage = reviewMode
    ? reviewProgressPercentage
    : studyProgressPercentage;
  const progressText = reviewMode
    ? `${Math.min(currentIndex, deck.length)} / ${deck.length}`
    : `${completedCount} / ${totalCount}`;

  const fireConfetti = () => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#f1c749ff", "#fffc43ff", "#f6ffa9ff"],
    });
  };

  const handleCheck = async () => {
    if (deck.length === 0) return;

    const currentWord = deck[currentIndex];
    if (!currentWord) return;

    const isCorrect = userAnswer.trim() === currentWord.answer_in_example;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      confettiFired.current = false;
      fireConfetti();
    }

    const nextIndex = currentIndex + 1;
    const updatedProgress = { ...progress, [currentWord.id]: isCorrect };

    await fetch("/api/study-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        wordId: currentWord.id,
        completed: isCorrect,
        currentIndex: nextIndex >= deck.length ? 0 : nextIndex,
        type: "fill",
        level,
      }),
    });
    setProgress(updatedProgress);

    setTimeout(async () => {
      setFeedback(null);
      setUserAnswer("");
      confettiFired.current = false;

      if (nextIndex >= deck.length) {
        const unlearned = deck.filter(
          (w) => !updatedProgress[w.id] && w.id !== currentWord.id
        );
        if (!isCorrect) unlearned.push(currentWord);

        if (unlearned.length > 0) {
          const proceed = confirm(
            `${unlearned.length} words need review. Continue?`
          );
          if (proceed) {
            const randomizedReviewDeck = shuffle<Word>(unlearned);
            setDeck(randomizedReviewDeck);
            setCurrentIndex(0);
            setReviewMode(true);
            await fetch("/api/review-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                type: "fill",
                level,
                wordIds: randomizedReviewDeck.map((w) => w.id),
                currentIndex: 0,
              }),
            });
            return;
          }
        }

        await fetch(`/api/study-progress/reset?type=fill&level=${level}`, {
          method: "POST",
          credentials: "include",
        });
        await fetch(`/api/review-session?type=fill&level=${level}`, {
          method: "DELETE",
          credentials: "include",
        });

        setProgress({});
        setReviewMode(false);
        alert(
          "You completed all Fill-in-the-Blank quizzes! Progress reset."
        );
        const baseDeck = fullDeck.length > 0 ? fullDeck : deck;
        const reshuffledFullDeck = shuffle<Word>(baseDeck);
        setFullDeck(reshuffledFullDeck);
        setDeck(reshuffledFullDeck);
        setTotalCount(reshuffledFullDeck.length);
        setCurrentIndex(0);
      } else {
        setCurrentIndex(nextIndex);
      }
    }, isCorrect ? 1000 : 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  useEffect(() => {
    if (!reviewMode) return;
    const saveSession = async () => {
      await fetch("/api/review-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: "fill",
          level,
          wordIds: deck.map((w) => w.id),
          currentIndex,
        }),
      });
    };
    saveSession();
  }, [reviewMode, currentIndex, deck, level]);

  if (loading) return <div className="text-center mt-40">Loading...</div>;
  if (deck.length === 0)
    return <div className="text-center mt-40">No words.</div>;

  const currentWord = deck[currentIndex];
  const englishMeaning = currentWord.meanings.find(
    (m) => m.language_code === "en"
  )?.example_sentence_meaning;

  const blankSentence = currentWord.example_sentence.replace(
    currentWord.answer_in_example,
    "____"
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col items-center overflow-hidden">
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow gap-8 mt-20 text-center px-6 w-full max-w-3xl">
        <div className="w-full px-6 flex flex-col items-center">
          <div className="w-full max-w-md bg-orange-50 rounded-full h-3 relative shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#F27D88",
                width: `${progressPercentage}%`,
              }}
            />
          </div>
          <p
            className="mt-2 font-bold font-outfit text-sm"
            style={{ color: "#503b3dff" }}
          >
            {progressText} {reviewMode && "(Review Mode)"}
          </p>
        </div>

        <div className="bg-orange-50/100 border border-rose-100 rounded-2xl shadow-xl px-8 py-10 w-full flex flex-col items-center gap-6">
          {feedback === "wrong" ? (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-noto-sans-jp">
              {
                currentWord.example_sentence.split(
                  currentWord.answer_in_example
                )[0]
              }
              <span className="text-red-500">
                {currentWord.answer_in_example}
              </span>
              {
                currentWord.example_sentence.split(
                  currentWord.answer_in_example
                )[1]
              }
            </h1>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-noto-sans-jp">
              {blankSentence}
            </h1>
          )}

          <p className="text-gray-600 text-lg font-outfit">
            {englishMeaning}
          </p>

          <input
            type="text"
            placeholder="Type your answer in Japanese."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!!feedback}
            className="bg-white shadow-inner rounded-xl px-4 py-3 w-80 text-center text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 font-noto-sans-jp"
          />

          <AnimatePresence>
            <motion.button
              key={feedback || "default"}
              initial={{ scale: 1 }}
              animate={
                feedback === "correct"
                  ? { scale: 1.15 }
                  : feedback === "wrong"
                    ? { x: [0, -100, 100, -100, 0] }
                    : { scale: 1 }
              }
              transition={{ duration: 0.4 }}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={!!feedback}
              className={`px-6 py-3 rounded-full font-bold shadow-md transition-transform ${
                feedback === "wrong"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : feedback === "correct"
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-[#F27D88] text-white hover:opacity-90"
              }`}
            >
              {feedback === "wrong"
                ? "Incorrect🥲"
                : feedback === "correct"
                  ? "Correct!✨"
                  : "CHECK ANSWER"}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
