"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PencilLine } from "lucide-react";

export default function HeroQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const correctId = 3;

  const choices = [
    { id: 1, text: "収入" },
    { id: 2, text: "募集" },
    { id: 3, text: "輸入" },
    { id: 4, text: "応募" },
  ];

  // Quiz feedback
  const handleSelect = (id: number) => {
    if (feedback) return;
    setSelected(id);
    const isCorrect = id === correctId;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
    }, 1500);
  };

  return (
    <section className="relative w-full py-36 px-6 bg-gradient-to-r from-orange-300/50 via-rose-300/60 to-orange-300/50">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2,
              ease: "easeInOut",
            }}
            className="mb-4"
          >
            <PencilLine className="w-16 h-16 text-rose-50" />
          </motion.div>

          {/* Title */}
          <h2 className="text-5xl font-bold font-outfit text-gray-800">
            Test your skills with quizzes.
          </h2>

          {/* Sub text */}
          <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Challenge yourself with interactive quizzes designed to reinforce
            your learning and track your progress.
          </p>
        </motion.div>

        {/* Demo quiz */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden"
        >
          <div className="flex-1 bg-gradient-to-b from-orange-50 to-rose-50 flex flex-col justify-center items-center p-10">
            <p className="text-2xl font-bold mb-6">問題</p>
            <p className="text-5xl font-bold">ゆにゅう</p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center p-10 gap-4">
            {choices.map((choice) => {
              const isSelected = selected === choice.id;
              const showCorrect = feedback === "correct" && isSelected;
              const showWrong = feedback === "wrong" && isSelected;
              return (
                <motion.button
                  key={choice.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSelect(choice.id)}
                  disabled={!!feedback}
                  className={`w-full px-5 py-3 rounded-full font-bold shadow text-gray-800 transition text-center ${
                    showCorrect
                      ? "bg-green-200 scale-105"
                      : showWrong
                        ? "bg-red-200 scale-105"
                        : "bg-white hover:shadow-lg"
                  }`}
                >
                  {choice.id}. {choice.text}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
