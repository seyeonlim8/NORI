import { motion } from "framer-motion";
import { BookOpen, NotebookPen } from "lucide-react";

export default function HeroFlashcard() {
  const words = ["暗記", "勉強", "日本語", "幸せ", "努力"];
  const meaning = ["memorization", "study", "Japanese", "happiness", "effort"];

  return (
    <section className="relative w-full py-36 flex flex-col items-center bg-gradient-to-b from-orange-100 to-rose-200 to-orange-200">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-10 text-4xl md:text-5xl font-bold text-gray-800 font-outfit text-center mb-10 flex flex-col items-center"
      >
        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mb-4"
        >
          <NotebookPen className="w-16 h-16 text-rose-400" />
        </motion.div>
        {/* Title */}
        Prep for JLPT.
      </motion.h2>

      {/* Sub text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-700 max-w-2xl mb-15"
      >
        Get ready for the JLPT with our customized flashcards for every level.
      </motion.p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl w-full px-6 mb-20">
        {/* Flashcards */}
        {words.map((lvl, idx) => (
          <motion.div
            key={lvl}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.8 }}
            className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center group hover:shadow-rose-300 hover:shadow-xl"
          >
            <BookOpen className="absolute top-4 right-4 w-6 h-6 text-rose-400 opacity-0 group-hover:opacity-100 transition duration-300 group-hover:scale-125 group-hover:drop-shadow-lg" />
            <h3 className="text-2xl font-bold text-black">{lvl}</h3>
            <p className="mt-2 text-gray-600 text-sm">{meaning[idx]}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
