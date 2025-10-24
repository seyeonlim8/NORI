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

export default function FillInTheBlankPage({ level }: { level: string }) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const confettiFired = useRef(false); // 중복 실행 방지

  // 유저 인증 확인
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/user", { credentials: "include" });
      if (!res.ok) window.location.href = "/login?redirect=/study/fill";
    };
    checkAuth();
  }, []);

  // 단어 로드
  useEffect(() => {
    const loadWords = async () => {
      const res = await fetch(`/api/words?level=${level}`);
      const data = await res.json();
      setWords(data);
      setTotalCount(data.length);
    };
    loadWords();
  }, [level]);

  // 진행도 로드
  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(`/api/study-progress?type=fill&level=${level}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: Record<number, boolean> = {};
        data.forEach((p: any) => (mapped[p.wordId] = p.completed));
        setProgress(mapped);

        // 최근 학습 위치 복원
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

  if (words.length === 0)
    return <div className="text-center mt-40">Loading...</div>;

  const currentWord = words[currentIndex];
  const englishMeaning = currentWord.meanings.find(
    (m) => m.language_code === "en"
  )?.example_sentence_meaning;

  const blankSentence = currentWord.example_sentence.replace(
    currentWord.answer_in_example,
    "____"
  );

  const fireConfetti = () => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }, // 화면 중간쯤
      colors: ["#f1c749ff", "#fffc43ff", "#f6ffa9ff"], // 초록 톤 스파클
    });
  };

  const handleCheck = async () => {
    const isCorrect = userAnswer.trim() === currentWord.answer_in_example;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      confettiFired.current = false;
      fireConfetti(); // 정답일 때 스파클 효과
    }

    const nextIndex = currentIndex + 1;
    const updatedProgress = { ...progress, [currentWord.id]: isCorrect };

    // DB 저장
    await fetch("/api/study-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        wordId: currentWord.id,
        completed: isCorrect,
        currentIndex: nextIndex >= words.length ? 0 : nextIndex,
        type: "fill",
        level,
      }),
    });
    setProgress(updatedProgress);

    setTimeout(
      () => {
        setFeedback(null);
        setUserAnswer("");
        confettiFired.current = false;
        if (nextIndex >= words.length) {
          const unlearned = words.filter(
            (w) => !updatedProgress[w.id] && w.id !== currentWord.id
          );
          if (!isCorrect) unlearned.push(currentWord);

          if (unlearned.length > 0) {
            if (confirm(`${unlearned.length} words need review. Continue?`)) {
              setWords(unlearned);
              setCurrentIndex(0);
              setReviewMode(true);
              return;
            }
          }

          // Reset progress
          fetch(`/api/study-progress/reset?type=fill&level=${level}`, {
            method: "POST",
            credentials: "include",
          });
          setProgress({});
          setReviewMode(false);
          alert("You completed all Fill-in-the-Blank quizzes! Progress reset.");
          setCurrentIndex(0);
        } else {
          setCurrentIndex(nextIndex);
        }
      },
      isCorrect ? 1000 : 1500
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressText = `${completedCount} / ${totalCount}`;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col items-center overflow-hidden">
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow gap-8 mt-20 text-center px-6 w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="w-full px-6 flex flex-col items-center">
          <div className="w-full max-w-md bg-orange-50 rounded-full h-3 relative shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#F27D88",
                width: `${(completedCount / totalCount) * 100}%`,
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

        {/* 메인 카드 */}
        <div className="bg-orange-50/100 border border-rose-100 rounded-2xl shadow-xl px-8 py-10 w-full flex flex-col items-center gap-6">
          {/* 예문 */}
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

          {/* 영어 번역 */}
          <p className="text-gray-600 text-lg font-outfit">{englishMeaning}</p>

          {/* 입력창 */}
          <input
            type="text"
            placeholder="Type your answer in Japanese."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!!feedback}
            className="bg-white shadow-inner rounded-xl px-4 py-3 w-80 text-center text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 font-noto-sans-jp"
          />

          {/* 버튼 (Correct/Incorrect + Confetti) */}
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
