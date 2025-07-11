import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroJoin() {
  return (
    <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-44 py-24 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_white_0%,_rgba(255,_255,_255,_0)_100%)] flex flex-col justify-start items-center gap-10 mx-auto">
      <div className="text-center text-zinc-600 text-sm font-bold font-(family-name:--font-outfit) uppercase leading-tight tracking-tight">
        join us now
      </div>
      <div className="text-center">
        <span className="text-neutral-900 text-5xl font-bold font-(family-name:--font-outfit) leading-[52.80px]">
          Start your Japanese Journey with{" "}
        </span>
        <span
          className="text-6xl font-bold font-(family-name:--font-outfit) leading-[70.40px]"
          style={{ color: "#F27D88" }}
        >
          {" "}
          NORI.
        </span>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 pt-2 pb-1.5 bg-rose-400 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer"
        style={{ backgroundColor: "#F27D88" }}
      >
        <Link href="/login">
          <div className="text-yellow-50 text-base font-bold font-(family-name:--font-outfit) uppercase leading-snug tracking-tight">
            start now
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
