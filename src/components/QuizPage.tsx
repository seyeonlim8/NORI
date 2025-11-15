"use client";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./Footer";

type Word = {
  id: number;
  level: string;
  kanji: string;
  furigana: string;
};

const shuffle = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function QuizPage({
  level,
  type,
}: {
  level: string;
  type: string;
}) {
  const router = useRouter();

  const [deck, setDeck] = useState<Word[]>([]);
  const [fullDeck, setFullDeck] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const progressType = `quiz-${type}`;

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user", { credentials: "include" });
      if (!res.ok) router.push(`/login?redirect=${window.location.pathname}`);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/words?level=${level}`);
        const data: Word[] = await res.json();
        const shuffled = shuffle<Word>(data);
        setFullDeck(shuffled);

        const sessRes = await fetch(
          `/api/review-session?type=${progressType}&level=${level}`,
          {
            credentials: "include",
          }
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
              setSelected(null);
              setLoading(false);
              return;
            }
          }
        }

        setDeck(shuffled);
        setReviewMode(false);
        setTotalCount(shuffled.length);
        setCurrentIndex(0);
        setSelected(null);
      } catch (error) {
        console.error("Failed to load quiz deck", error);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [level, progressType]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(
        `/api/study-progress?type=${progressType}&level=${level}`,
        {
          credentials: "include",
        }
      );
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
  }, [level, progressType, reviewMode, fullDeck]);

  const generateOptions = (word: Word, source: Word[]) => {
    const correct = type === "kanji-to-furigana" ? word.furigana : word.kanji;
    const pool = source.length > 0 ? source : deck;

    let candidates = Array.from(
      new Set(
        pool
          .filter((w) => w.id !== word.id)
          .map((w) => (type === "kanji-to-furigana" ? w.furigana : w.kanji))
      )
    ).sort(() => Math.random() - 0.5);

    while (candidates.length < 3) {
      candidates.push(correct);
    }

    const opts = [...candidates.slice(0, 3), correct].sort(
      () => Math.random() - 0.5
    );

    setOptions(opts);
  };

  useEffect(() => {
    if (deck.length > 0 && currentIndex < deck.length) {
      const word = deck[currentIndex];
      const sourcePool = fullDeck.length > 0 ? fullDeck : deck;
      generateOptions(word, sourcePool);
    } else {
      setOptions([]);
    }
  }, [deck, fullDeck, currentIndex, type]);

  const handleAnswer = async (choice: string) => {
    if (selected || deck.length === 0) return;

    const currentWord = deck[currentIndex];
    if (!currentWord) return;

    const correct =
      type === "kanji-to-furigana" ? currentWord.furigana : currentWord.kanji;
    const isCorrect = choice === correct;

    setSelected(choice);

    const nextIndex = currentIndex + 1;
    const nextProgress = { ...progress, [currentWord.id]: isCorrect };

    await fetch("/api/study-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        wordId: currentWord.id,
        completed: isCorrect,
        currentIndex: nextIndex >= deck.length ? 0 : nextIndex,
        type: progressType,
        level,
      }),
    });

    setProgress(nextProgress);

    const deckWordIds = deck.map((w) => w.id);
    let canceledReviewPrompt = false;

    setTimeout(async () => {
      setSelected(null);

      if (nextIndex >= deck.length) {
        const unlearned = deck.filter(
          (w) => !nextProgress[w.id] && w.id !== currentWord.id
        );
        if (!isCorrect) unlearned.push(currentWord);

        if (unlearned.length > 0) {
          const proceed = confirm(
            `${unlearned.length} words need review. Continue?\nIf you don't enter Review Mode now, your progress will be reset.`
          );
          if (proceed) {
            const randomizedReviewDeck = shuffle<Word>(unlearned);
            const reviewIds = randomizedReviewDeck.map((w) => w.id);
            setDeck(randomizedReviewDeck);
            setCurrentIndex(0);
            setReviewMode(true);
            await fetch("/api/review-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                type: progressType,
                level,
                wordIds: reviewIds,
                currentIndex: 0,
              }),
            });
            return;
          } else {
            canceledReviewPrompt = true;
          }
        }

        await fetch(
          `/api/study-progress/reset?type=${progressType}&level=${level}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        await fetch(`/api/review-session?type=${progressType}&level=${level}`, {
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
        if (canceledReviewPrompt) {
          router.push("/study/quiz");
          return;
        }
        alert("Quiz completed! Progress reset.");
      } else {
        setCurrentIndex(nextIndex);
        if (reviewMode) {
          await fetch("/api/review-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              type: progressType,
              level,
              wordIds: deckWordIds,
              currentIndex: nextIndex,
            }),
          });
        }
      }
    }, 500);
  };

  useEffect(() => {
    if (!reviewMode) return;
    const saveSession = async () => {
      await fetch("/api/review-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: progressType,
          level,
          wordIds: deck.map((w) => w.id),
          currentIndex,
        }),
      });
    };
    saveSession();
  }, [reviewMode, currentIndex, deck, level, progressType]);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const reviewProgressPercentage =
    reviewMode && deck.length > 0 ? (currentIndex / deck.length) * 100 : 0;
  const studyProgressPercentage =
    !reviewMode && totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const progressPercentage = reviewMode
    ? reviewProgressPercentage
    : studyProgressPercentage;
  const progressText = reviewMode
    ? `${Math.min(currentIndex, deck.length)} / ${deck.length}`
    : `${completedCount} / ${totalCount}`;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selected) return;
      const numeric = parseInt(event.key, 10);
      if (Number.isNaN(numeric)) return;
      const optionIndex = numeric - 1;
      if (optionIndex < 0 || optionIndex >= options.length) return;
      handleAnswer(options[optionIndex]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, selected, handleAnswer]);

  if (loading) return <div className="text-center mt-40">Loading...</div>;
  if (deck.length === 0)
    return <div className="text-center mt-40">No words.</div>;

  const currentWord = deck[currentIndex];
  const question =
    type === "kanji-to-furigana" ? currentWord.kanji : currentWord.furigana;
  const correctAnswer =
    type === "kanji-to-furigana" ? currentWord.furigana : currentWord.kanji;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col items-center overflow-hidden">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-32 pb-5 flex flex-col flex-grow justify-start items-center gap-10 mx-auto"
      >
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
            className="mt-1 font-bold font-outfit text-sm"
            style={{ color: "#503b3dff" }}
          >
            {progressText} {reviewMode && "(Review Mode)"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-10 w-full">
          <div
            data-testid="question-box"
            data-word-id={`${currentWord.id}`}
            className="relative bg-orange-50 rounded-[24px] shadow-lg px-8 py-10 min-h-[400px] flex items-center justify-center text-4xl font-bold font-noto-sans-jp w-full max-w-[600px]"
          >
            {question}
          </div>

          <div className="flex flex-col gap-10">
            {options.map((opt, idx) => {
              const isCorrect = opt === correctAnswer;
              const isSelected = opt === selected;

              return (
                <button
                  key={`${opt}-${idx}`}
                  data-testid={`answer-${idx + 1}`}
                  data-answer-text={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`w-64 h-16 px-6 py-3 rounded-lg shadow font-noto-sans-jp text-lg text-center transition-colors duration-200
          ${
            selected
              ? isCorrect
                ? "bg-green-400 text-white"
                : isSelected
                  ? "bg-red-400 text-white"
                  : "bg-orange-100"
              : "bg-orange-50 hover:bg-orange-100"
          }`}
                >
                  {`${idx + 1}. ${opt}`}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
