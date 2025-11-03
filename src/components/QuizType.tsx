"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

const MotionLink = motion(Link);

export default function QuizTypePage({ level }: { level: string }) {
  const types = [
    { key: "kanji-to-furigana", label: "漢字 → ふりがな" },
    { key: "furigana-to-kanji", label: "ふりがな → 漢字" },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 via-orange-100 to-rose-50 flex flex-col items-center overflow-hidden">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center w-full max-w-5xl mx-auto px-6 pt-16 gap-12 flex-grow"
      >
        <h2 className="text-4xl font-bold text-[#F27D88] font-outfit text-center">
          ✨ Select Your Quiz Type
        </h2>

        <div className="flex justify-center gap-8">
          {types.map((type, index) => (
            <MotionLink
              key={type.key}
              data-testid={`${type.key}-btn`}
              href={`/study/quiz/${level}/${type.key}`} // 레벨 포함해서 라우팅
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.4,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-56 h-40 flex items-center justify-center rounded-2xl bg-white border border-rose-200 shadow-sm
                         hover:border-rose-400 hover:bg-rose-50 transition-all duration-300 text-2xl font-bold text-[#F27D88] font-outfit text-center px-4"
            >
              {type.label}
            </MotionLink>
          ))}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
