"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/navigation";

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

const clampIndex = (idx: number, length: number) => {
  if (length === 0) return 0;
  return Math.min(Math.max(idx, 0), length - 1);
};

const normalizeAnswer = (value: string) => value.trim().normalize("NFKC");

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
  const router = useRouter();
  const baseSessionType = "fill-base";
  const persistBaseDeck = async (deckWords: Word[], currentIdx = 0) => {
    try {
      await fetch("/api/review-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: baseSessionType,
          level,
          wordIds: deckWords.map((w) => w.id),
          currentIndex: currentIdx,
        }),
      });
    } catch (error) {
      console.error("Failed to persist fill-in-the-blank base deck", error);
    }
  };

  const saveReviewSession = async (wordIds: number[], nextIndex: number) => {
    try {
      await fetch("/api/review-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: "fill",
          level,
          wordIds,
          currentIndex: nextIndex,
        }),
      });
    } catch (error) {
      console.error("Failed to persist fill-in-the-blank session", error);
    }
  };

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
        const wordMap = new Map(data.map((w) => [w.id, w]));
        let baseDeck: Word[] = [];
        let needsPersist = false;

        try {
          const baseSessionRes = await fetch(
            `/api/review-session?type=${baseSessionType}&level=${level}`,
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
              const missing = data.filter((w) => !orderedIds.has(w.id));
              const combinedDeck = [...ordered, ...missing];
              if (combinedDeck.length === data.length) {
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
          console.error("Failed to load fill base deck order", error);
        }

        if (baseDeck.length === 0) {
          baseDeck = shuffle<Word>(data);
          needsPersist = true;
        }

        if (baseDeck.length !== data.length) {
          baseDeck = [...data];
          needsPersist = true;
        }

        if (needsPersist) {
          await persistBaseDeck(baseDeck, 0);
        }

        setFullDeck(baseDeck);

        const sessRes = await fetch(
          `/api/review-session?type=fill&level=${level}`,
          { credentials: "include" }
        );

        if (sessRes.ok) {
          const session = await sessRes.json();
          if (session && Array.isArray(session.wordIds)) {
            const dict = new Map(baseDeck.map((w) => [w.id, w]));
            const sessionDeck = (session.wordIds as number[])
              .map((id) => dict.get(id))
              .filter(Boolean) as Word[];
            if (sessionDeck.length > 0) {
              setDeck(sessionDeck);
              setTotalCount(baseDeck.length);
              setReviewMode(true);
              const resumeIndex = clampIndex(
                typeof session.currentIndex === "number"
                  ? session.currentIndex
                  : 0,
                sessionDeck.length
              );
              setCurrentIndex(resumeIndex);
              setUserAnswer("");
              setFeedback(null);
              setLoading(false);
              return;
            }
          }
        }

        setDeck(baseDeck);
        setReviewMode(false);
        setTotalCount(baseDeck.length);
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
    if (loading) return;
    const fetchProgress = async () => {
      const res = await fetch(`/api/study-progress?type=fill&level=${level}`, {
        credentials: "include",
      });
      if (!res.ok) return;

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
    };

    fetchProgress();
  }, [level, reviewMode, fullDeck, loading]);

  useEffect(() => {
    if (deck.length === 0) return;
    setCurrentIndex((idx) => clampIndex(idx, deck.length));
  }, [deck]);

  const reviewCompletedCount = reviewMode
    ? deck.reduce((acc, w) => acc + (progress[w.id] ? 1 : 0), 0)
    : 0;
  const reviewProgressPercentage =
    reviewMode && deck.length > 0
      ? (reviewCompletedCount / deck.length) * 100
      : 0;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const studyProgressPercentage =
    !reviewMode && totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const progressPercentage = reviewMode
    ? reviewProgressPercentage
    : studyProgressPercentage;
  const progressText = reviewMode
    ? `${reviewCompletedCount} / ${deck.length}`
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

    const isCorrect =
      normalizeAnswer(userAnswer) ===
      normalizeAnswer(currentWord.answer_in_example);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      confettiFired.current = false;
      fireConfetti();
    }

    const nextIndex = currentIndex + 1;
    const updatedProgress = { ...progress, [currentWord.id]: isCorrect };
    const deckWordIds = deck.map((w) => w.id);
    let canceledReviewPrompt = false;

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

    setTimeout(
      async () => {
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
              `${unlearned.length} words need review. Continue?\nIf you don't enter Review Mode now, your progress will be reset.`
            );
            if (proceed) {
              const randomizedReviewDeck = shuffle<Word>(unlearned);
              setDeck(randomizedReviewDeck);
              setCurrentIndex(0);
              setReviewMode(true);
              await saveReviewSession(
                randomizedReviewDeck.map((w) => w.id),
                0
              );
              return;
            } else {
              canceledReviewPrompt = true;
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
          const baseDeck = fullDeck.length > 0 ? fullDeck : deck;
        const reshuffledFullDeck = shuffle<Word>(baseDeck);
        setFullDeck(reshuffledFullDeck);
        setDeck(reshuffledFullDeck);
        setTotalCount(reshuffledFullDeck.length);
        setCurrentIndex(0);
        await persistBaseDeck(reshuffledFullDeck, 0);
          if (canceledReviewPrompt) {
            router.push("/study/fill-in-the-blank");
            return;
          }
          alert("You completed all Fill-in-the-Blank quizzes! Progress reset.");
        } else {
          setCurrentIndex(nextIndex);
          if (reviewMode) {
            await saveReviewSession(deckWordIds, nextIndex);
          }
        }
      },
      isCorrect ? 1000 : 1500
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

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
          <div
            data-testid="progress-bar-outer"
            className="w-full max-w-md bg-orange-50 rounded-full h-3 relative shadow-inner"
          >
            <div
              data-testid="progress-bar-inner"
              className="h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#F27D88",
                width: `${progressPercentage}%`,
              }}
            />
          </div>
          <p
            data-testid="progress-counter"
            className="mt-2 font-bold font-outfit text-sm"
            style={{ color: "#503b3dff" }}
          >
            {progressText} {reviewMode && "(Review Mode)"}
          </p>
        </div>

        <div
          data-testid="fill-box"
          data-word-id={currentWord.id}
          className="bg-orange-50/100 border border-rose-100 rounded-2xl shadow-xl px-8 py-10 w-full flex flex-col items-center gap-6"
        >
          {feedback === "correct" || feedback === "wrong" ? (
            <h1
              data-testid="blank-sentence"
              className="text-3xl md:text-4xl font-bold text-gray-800 font-noto-sans-jp"
            >
              {
                currentWord.example_sentence.split(
                  currentWord.answer_in_example
                )[0]
              }
              <span
                data-testid="fill-answer"
                className={
                  feedback === "correct" ? "text-green-500" : "text-red-500"
                }
              >
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

          <p
            data-testid="english-meaning"
            className="text-gray-600 text-lg font-outfit"
          >
            {englishMeaning}
          </p>

          <input
            data-testid="input-box"
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
              data-testid="submit-btn"
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
