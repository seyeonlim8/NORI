"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

type Word = {
  id: number;
  level: string;
  kanji: string;
  furigana: string;
};

export default function QuizPage({
  level,
  type,
}: {
  level: string;
  type: string;
}) {
  const router = useRouter();

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user", { credentials: "include" });
      if (!res.ok) router.push(`/login?redirect=${window.location.pathname}`);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(`/api/study-progress?type=quiz&level=${level}`, {
        credentials: "include",
      });
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

  useEffect(() => {
    const loadWords = async () => {
      setLoading(true);
      const res = await fetch(`/api/words?level=${level}`);
      const data = await res.json();
      setWords(data);
      setTotalCount(data.length); // 전체 단어 수 따로 저장
      setLoading(false);
    };
    loadWords();
  }, [level]);

  const generateOptions = (word: Word) => {
    const correct = type === "kanji-to-furigana" ? word.furigana : word.kanji;

    // 후보: 중복 제거 후 무작위 셔플
    let candidates = Array.from(
      new Set(
        words
          .filter((w) => w.id !== word.id)
          .map((w) => (type === "kanji-to-furigana" ? w.furigana : w.kanji))
      )
    ).sort(() => Math.random() - 0.5);

    // 후보가 부족하면 강제로 채워서 3개 맞춤
    while (candidates.length < 3) {
      candidates.push(correct); // 부족하면 정답을 중복으로라도 넣음
    }

    // 정확히 3개로 자르고 정답 포함해서 4개 만들기
    const opts = [...candidates.slice(0, 3), correct].sort(
      () => Math.random() - 0.5
    );

    // 이전 상태랑 합치지 않고, 항상 새 배열로 덮어쓰기
    setOptions(opts);
  };

  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      generateOptions(words[currentIndex]);
    } else {
      setOptions([]); // 단어가 없으면 보기 초기화
    }
  }, [words, currentIndex, type]);

  const handleAnswer = async (choice: string) => {
    const currentWord = words[currentIndex];
    const correct =
      type === "kanji-to-furigana" ? currentWord.furigana : currentWord.kanji;
    const isCorrect = choice === correct;

    setSelected(choice);

    const nextIndex = currentIndex + 1;
    const nextProgress = { ...progress, [currentWord.id]: isCorrect }; // 미리 업데이트

    await fetch("/api/study-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        wordId: currentWord.id,
        completed: isCorrect,
        currentIndex: nextIndex >= words.length ? 0 : nextIndex,
        type: "quiz",
        level,
      }),
    });
    setProgress(nextProgress);

    setTimeout(() => {
      setSelected(null);
      if (nextIndex >= words.length) {
        const unlearned = words.filter(
          (w) => !nextProgress[w.id] && w.id !== currentWord.id
        ); // 최신 progress로 필터링
        if (!isCorrect) unlearned.push(currentWord);

        if (unlearned.length > 0) {
          if (confirm(`${unlearned.length} words need review. Continue?`)) {
            setWords(unlearned);
            setCurrentIndex(0);
            setReviewMode(true);
            return;
          }
        }

        fetch(`/api/study-progress/reset?type=quiz&level=${level}`, {
          method: "POST",
          credentials: "include",
        });
        setProgress({});
        setReviewMode(false);
        alert("Quiz completed! Progress reset.");
        setCurrentIndex(0);
      } else {
        setCurrentIndex(nextIndex);
      }
    }, 500);
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressText = `${completedCount} / ${totalCount}`;

  if (loading) return <div className="text-center mt-40">Loading...</div>;
  if (words.length === 0)
    return <div className="text-center mt-40">No words.</div>;

  const currentWord = words[currentIndex];
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
        className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-32 pb-5 flex flex-col justify-start items-center gap-10 mx-auto"
      >
        {/* Progress Bar */}
        <div className="w-full px-6 flex flex-col items-center">
          <div className="w-md bg-orange-50 rounded-full h-3 relative">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#F27D88",
                width: `${(completedCount / totalCount) * 100}%`,
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

        {/* Question */}
        <div className="flex items-center justify-center gap-10 w-full">
          <div className="relative bg-orange-50 rounded-[24px] shadow-lg px-8 py-10 min-h-[400px] flex items-center justify-center text-4xl font-bold font-outfit w-full max-w-[600px]">
            {question}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-10">
            {options.map((opt, idx) => {
              const isCorrect = opt === correctAnswer;
              const isSelected = opt === selected;

              return (
                <button
                  key={`${opt}-${idx}`} // 키는 고유하게
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`w-64 h-16 px-6 py-3 rounded-lg shadow font-outfit text-lg text-center transition-colors duration-200
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
                  {`${idx + 1}. ${opt}`} {/* 번호 붙여서 표시 */}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
