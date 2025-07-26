import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroBlank() {
  return (
    <section className="relative w-full py-36 px-6 flex flex-col items-center text-center mt-20 mb-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold font-outfit text-gray-800 mb-6 flex flex-col items-center gap-3"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <Sparkles className="w-14 h-14 text-yellow-400" />
        </motion.div>
        {/* Title */}
        Master Vocabulary in Context
      </motion.h2>

      {/* Sub text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-700 max-w-3xl mb-12"
      >
        Context matters! Strengthen retention by filling in words in real
        sentences, and see your reading comprehension improve daily.
      </motion.p>

      {/* Image */}
      <motion.img
        src="/fill-in-the-blank.png"
        alt="Fill in the blank example"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring" }}
        className="max-w-4xl rounded-2xl"
      />
    </section>
  );
}
