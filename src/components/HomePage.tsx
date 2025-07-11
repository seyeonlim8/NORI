"use client";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import HeroMain from "./HeroMain";
import HeroJLPT from "./HeroJLPT";
import HeroQuiz from "./HeroQuiz";
import HeroBlank from "./HeroBlank";
import HeroJoin from "./HeroJoin";

export default function HomePage() {
  return (
    <div className="w-full bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col justify-start items-center overflow-hidden">
      <Header />

      <HeroMain />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-12 pb-5 flex flex-col justify-start items-center gap-10 mx-auto"
      >
        <HeroJLPT />
        <HeroQuiz />
        <HeroBlank />
        <HeroJoin />
      </motion.div>

      <Footer />
    </div>
  );
}
