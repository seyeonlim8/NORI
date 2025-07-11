import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroMain() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-44 py-36 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_#FEB098_12%,_#FFD1B7_32%,_rgba(255,_255,_255,_0)_100%)] flex flex-col justify-start items-center gap-10 mx-auto"
    >
      <div className="w-full max-w-3xl flex flex-col justify-start items-center gap-5">
        <div className="text-center">
          <span className="text-black text-6xl font-bold font-(family-name:--font-outfit) leading-[70.40px]">
            Learn Japanese Effectively with
          </span>
          <span
            className="text-6xl font-bold font-(family-name:--font-outfit) leading-[70.40px]"
            style={{ color: "#F27D88" }}
          >
            {" "}
            NORI.
          </span>
        </div>
        <div className="text-center text-zinc-600 text-xl font-bold font-(family-name:--font-outfit) leading-7 tracking-tight">
          Master vocabulary and grammar through flashcards,
          <br />
          example sentences, and quizzes.
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 pt-2 pb-1.5 bg-rose-400 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer"
        style={{ backgroundColor: "#F27D88" }}
      >
        <Link href="/login">
          <div className="text-yellow-50 text-base font-bold font-(family-name:--font-outfit) uppercase leading-snug tracking-tight">
            GET STARTED
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
