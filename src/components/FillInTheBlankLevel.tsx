"use client";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import LevelCards from "./LevelCards";

export default function FillInTheBlankLevel() {
  const levels = ["N1", "N2", "N3", "N4", "N5"];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 via-orange-100 to-rose-50 flex flex-col items-center overflow-hidden">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center w-full max-w-5xl mx-auto px-6 pt-16 gap-12 flex-grow"
      >
        <h2 className="text-4xl font-bold text-black font-outfit text-center relative z-10">
          ☘️ Select Your JLPT Level — Let’s Fill In the Blanks.
        </h2>

        <LevelCards levels={levels} basePath="study/fill-in-the-blank" />
      </motion.div>

      <Footer />
    </div>
  );
}
