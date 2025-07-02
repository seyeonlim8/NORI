"use client";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="w-full bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col justify-start items-center overflow-hidden">
      <div className="w-full max-w-screen-xl p-1 sm:p-1 flex justify-between items-center mx-auto border-b border-red-800">
        <img className="w-43 h-15" src="nori-logo-w-text.png" />
        <div className="flex justify-end items-center gap-6">
          {["STUDY", "ABOUT", "CONTACT"].map((item) => (
            <div
              key={item}
              className="text-stone-800 text-sm font-bold font-(family-name:--font-outfit) uppercase leading-tight tracking-tight"
            >
              {item}
            </div>
          ))}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 pt-2 pb-1.5 bg-orange-300 rounded flex justify-center items-center gap-2.5 cursor-pointer"
          >
            <div className="text-yellow-50 text-base font-bold font-(family-name:--font-outfit) uppercase leading-tight tracking-tight">
              LOG IN
            </div>
          </motion.div>
        </div>
      </div>

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
            <span className="text-rose-400 text-6xl font-bold font-(family-name:--font-outfit) leading-[70.40px]">
              {" "}
              NORI.
            </span>
          </div>
          <div className="text-center text-zinc-600 text-xl font-bold font-(family-name:--font-outfit) leading-7 tracking-tight">
            Master vocabulary and grammar through flashcards,
            <br />
            example sentences, and progress tracking.
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 pt-2 pb-1.5 bg-rose-400 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer"
        >
          <div className="text-yellow-50 text-base font-bold font-(family-name:--font-outfit) uppercase leading-snug tracking-tight">
            GET STARTED
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-12 pb-5 flex flex-col justify-start items-center gap-10 mx-auto"
      >
        <img className="w-full h-auto" src="cards.png" alt="Cards" />

        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-44 pt-12 pb-60 flex flex-col justify-start items-center gap-10 mx-auto">
          <div className="w-full max-w-3xl flex flex-col justify-start items-center gap-5">
            <div className="text-center text-black text-6xl font-bold font-(family-name:--font-outfit) leading-[61.60px]">
              Prep for JLPT.
            </div>
            <div className="text-center text-black/60 text-2xl font-medium font-(family-name:--font-figtree) leading-7">
              Get ready for the JLPT with our customized flashcards for every
              level
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-screen-xl px-4 sm:px-6 lg:px-16 pb-24 flex flex-col justify-start items-center gap-28 overflow-hidden mx-auto">
          <div className="self-stretch flex flex-col justify-start items-center gap-6">
            <img
              className="w-full h-full object-cover"
              src="test-your-skills.png"
            />
          </div>
        </div>

        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-16 pt-36 pb-12 bg-[radial-gradient(ellipse_41.64%_42.16%_at_50%_50%,_rgba(242.39,_124.69,_136.23,_0.62)_21%,_rgba(255,_255,_255,_0)_100%)] flex flex-col justify-center items-center overflow-hidden mx-auto">
          <div className="w-full flex flex-col justify-start items-center gap-6">
            <div className="text-black text-6xl font-bold font-(family-name:--font-outfit) leading-[61.60px]">
              Fill in the ____.
            </div>
            <div className="text-black/60 text-2xl font-medium font-(family-name:--font-figtree) leading-9">
              Enhance your skills in grammar and vocabulary through engaging
              example sentences
            </div>
          </div>
          <img
            className="w-full max-w-3xl h-auto mt-10"
            src="fill-in-the-blank.png"
          />
        </div>

        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-44 py-24 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_white_0%,_rgba(255,_255,_255,_0)_100%)] flex flex-col justify-start items-center gap-10 mx-auto">
          <div className="text-center text-zinc-600 text-sm font-bold font-(family-name:--font-outfit) uppercase leading-tight tracking-tight">
            join us now
          </div>
          <div className="text-center">
            <span className="text-neutral-900 text-5xl font-bold font-(family-name:--font-outfit) leading-[52.80px]">
              Start your Japanese Journey with{" "}
            </span>
            <span className="text-rose-400 text-6xl font-bold font-(family-name:--font-outfit) leading-[70.40px]">
              {" "}
              NORI
            </span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 pt-2 pb-1.5 bg-rose-400 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer"
          >
            <div className="text-yellow-50 text-base font-bold font-(family-name:--font-outfit) uppercase leading-snug tracking-tight">
              start now
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="w-full max-w-screen-xl p-4 sm:p-8 flex justify-between items-center overflow-hidden mx-auto">
        <img className="w-43 h-15" src="nori-logo-w-text.png" />
        <div className="flex justify-end items-center gap-6">
          <div className="w-6 h-6 bg-black/40 rounded-full" />
          <div className="w-6 h-6 bg-white rounded-full" />
          <div className="w-6 h-6 bg-black/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
