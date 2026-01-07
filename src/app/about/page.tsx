"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BookOpen,
  HelpCircle,
  Pencil,
  Users,
  Target,
  GraduationCap,
  BarChart,
} from "lucide-react";

// Count up
function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // 60fps 기준
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

const testimonials = [
  { name: "Alice (N3)", text: "NORI made studying fun and effective!" },
  { name: "Brian (N2)", text: "The progress tracking kept me motivated." },
  { name: "Cathy (N4)", text: "I finally feel confident for my JLPT!" },
];

function StatCard({
  end,
  label,
  delay,
}: {
  end: number;
  label: string;
  delay: number;
}) {
  const count = useCountUp(end);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="flex flex-col items-center gap-4 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-orange-200 rounded-full blur-sm opacity-90 pointer-events-none"></div>
      <span className="text-5xl font-bold text-[#F27D88] z-10">
        {count.toLocaleString()}+
      </span>
      <span className="text-gray-700 z-10">{label}</span>
    </motion.div>
  );
}

export default function AboutPage() {
  const [index, setIndex] = useState(0);

  // Switch testimonials
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      2500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-rose-100 via-orange-100 to-rose-50 flex flex-col justify-start items-center overflow-hidden">
      <Header />

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-24 px-6 max-w-7xl">
        <motion.img
          src="/japan-books.jpg"
          alt="NORI Japanese Learning"
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl aspect-[21/9] object-cover rounded-xl shadow-lg mb-10"
        />
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold font-outfit bg-gradient-to-r from-[#F27D88] via-rose-400 to-orange-300 bg-clip-text text-transparent"
        >
          Learn Japanese Effectively with{" "}
          <span className="font-caprasimo">NORI☘️</span>
        </motion.h1>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl font-bold font-outfit text-gray-700 max-w-2xl leading-relaxed"
        >
          A modern web platform to help JLPT learners master vocabulary, kanji,
          and sentence practice — all in one place.
        </motion.p>
      </section>

      {/* Why Choose NORI? */}
      <section className="flex flex-col items-center py-36 px-6 gap-20 max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 font-outfit"
        >
          Why Choose NORI?
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {[
            {
              title: "Flashcard Study",
              desc: "Memorize JLPT words by level with example sentences and meanings.",
              icon: <BookOpen className="w-12 h-12 text-rose-400 mb-4" />,
            },
            {
              title: "Reading & Kanji Quizzes",
              desc: "Practice kanji-to-furigana and furigana-to-kanji quizzes with 4 choices.",
              icon: <HelpCircle className="w-12 h-12 text-orange-400 mb-4" />,
            },
            {
              title: "Fill-in-the-Blank",
              desc: "Reinforce your vocabulary by filling in key words in example sentences.",
              icon: <Pencil className="w-12 h-12 text-pink-400 mb-4" />,
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl"
            >
              {card.icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who is NORI for? */}
      <section className="w-full py-36 bg-gradient-to-r from-orange-200 via-rose-200 to-orange-200">
        <div className="max-w-7xl mx-auto flex flex-col gap-2 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center font-outfit">
            Who is NORI for?
          </h2>
          {[
            {
              title: "JLPT Test Takers",
              desc: "Prepare effectively for all levels (N5–N1) with focused study paths.",
              icon: <GraduationCap className="w-16 h-16 text-rose-400" />,
            },
            {
              title: "Casual Learners",
              desc: "Study Japanese at your own pace with fun flashcards and quizzes.",
              icon: <Users className="w-16 h-16 text-orange-400" />,
            },
            {
              title: "Goal-Oriented Students",
              desc: "Track progress and optimize your learning routine effortlessly.",
              icon: <Target className="w-16 h-16 text-pink-400" />,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-md">
                {item.icon}
              </div>
              <div className="text-center md:text-left max-w-md">
                <h3 className="text-2xl font-bold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How Does NORI Work? */}
      <section className="flex flex-col items-center py-36 px-6 gap-20 max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 font-outfit"
        >
          How Does NORI Work?
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 w-full">
          {[
            {
              step: "1",
              title: "Choose Your JLPT Level",
              icon: <BookOpen className="w-10 h-10 text-rose-400" />,
            },
            {
              step: "2",
              title: "Study & Practice",
              icon: <Pencil className="w-10 h-10 text-orange-400" />,
            },
            {
              step: "3",
              title: "Track Progress & Review",
              icon: <BarChart className="w-10 h-10 text-pink-400" />,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="flex flex-col items-center text-center max-w-xs"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4">
                {item.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Step {item.step}
              </h4>
              <p className="text-gray-600">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-36 w-full bg-gradient-to-r from-rose-100 via-orange-100 to-rose-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-outfit">
            What Our Users Say
          </h2>
          <div className="relative h-40 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col justify-center items-center"
              >
                <p className="text-2xl italic text-gray-700 max-w-2xl">
                  &ldquo;{testimonials[index].text}&rdquo;
                </p>
                <span className="mt-4 font-bold text-[#F27D88] text-lg">
                  {testimonials[index].name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="flex flex-col items-center py-36 px-6 gap-24 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full text-center">
          {[
            { end: 10000, label: "Words in Our Database" },
            { end: 5, label: "JLPT Levels Supported" },
            { end: 1000, label: "Active Learners" },
          ].map((stat, idx) => (
            <StatCard
              key={stat.label}
              end={stat.end}
              label={stat.label}
              delay={idx * 0.2}
            />
          ))}
        </div>
      </section>

      {/* CTA Button */}
      <section className="flex flex-col items-center py-36 px-6 text-center">
        <motion.h3
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 font-outfit"
        >
          Ready to Master Japanese? 😉
        </motion.h3>
        <motion.a
          href="/signup"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-[#F27D88] text-white rounded-full font-bold shadow-md hover:shadow-rose-300 transition"
        >
          Get Started for Free
        </motion.a>
      </section>

      <Footer />
    </div>
  );
}
