import { BookOpen, CircleChevronDown } from "lucide-react";
import { FloatingIcons } from "./FloatingIcons";
import { motion } from "framer-motion";

export default function HeroMain() {
  return (
    <section className="relative z-10 w-full h-[85vh] flex flex-col justify-center items-center text-center bg-gradient-to-b from-rose-100 to-orange-100 overflow-hidden">
      <FloatingIcons count={15} />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-bold font-outfit bg-gradient-to-r from-[#F27D88] via-rose-400 to-orange-300 bg-clip-text text-transparent relative"
      >
        Learn Japanese the Smart Way
      </motion.h1>

      {/* Sub text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-6 flex items-center justify-center gap-3 text-gray-700 relative z-10"
      >
        <BookOpen className="w-8 h-8 text-rose-400" />
        <span className="font-bold text-lg">JLPT Vocabulary & Kanji</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-6 text-lg md:text-2xl text-gray-700 max-w-xl leading-relaxed relative z-10"
      >
        Master essential words, kanji, and sentence patterns for the JLPT.
      </motion.p>

      {/* CTA Button */}
      <motion.a
        href="/study/flashcards/n5"
        whileHover={{ scale: 1.1, boxShadow: "0 0 25px #F27D88" }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 mb-12 px-10 py-4 bg-[#F27D88] text-white font-bold rounded-full shadow-lg transition animate-pulse relative z-10"
      >
        Start Your Journey
      </motion.a>

      {/* Scroll down icon */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0.6, 1, 0.6],
          y: [0, 15, 0], // little bounce
          scale: [1, 1.1, 1], // zoom in/out
          filter: [
            "drop-shadow(0 0 0px rgba(242, 201, 125, 0.5))",
            "drop-shadow(0 0 10px rgba(242, 217, 125, 0.8))",
            "drop-shadow(0 0 0px rgba(242, 201, 125, 0.5))",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-4 cursor-pointer"
      >
        <CircleChevronDown className="w-12 h-12 text-orange-400" />
      </motion.div>
    </section>
  );
}
