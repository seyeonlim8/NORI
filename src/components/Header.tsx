"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full max-w-screen-xl p-1 sm:p-1 flex justify-between items-center mx-auto border-b border-red-800">
      <Link href="/">
        <img className="w-43 h-15 cursor-pointer" src="/nori-logo-w-text.png" />
      </Link>

      <div className="flex justify-end items-center gap-6">
        {/* STUDY with dropdown */}
        <div className="relative group cursor-pointer">
          <div className="text-stone-800 text-sm font-bold uppercase leading-tight tracking-tight font-outfit">
            STUDY
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
            <ul className="py-2">
              {[
                { label: "Flashcards", href: "/study/flashcards" },
                { label: "Quiz", href: "/study/quiz" },
                { label: "Fill in the blank", href: "/study/fill-in-the-blank" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>
                    <div className="px-5 py-3 text-sm text-gray-700 hover:bg-rose-100 hover:text-rose-500 transition font-outfit">
                      {label}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {["ABOUT", "CONTACT"].map((item) => (
          <div
            key={item}
            className="text-stone-800 text-sm font-bold uppercase leading-tight tracking-tight font-outfit cursor-pointer"
          >
            {item}
          </div>
        ))}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 pt-2 pb-1.5 bg-orange-300 rounded flex justify-center items-center gap-2.5 cursor-pointer"
        >
          <Link href="/login">
            <div className="text-yellow-50 text-base font-bold uppercase leading-tight tracking-tight font-outfit">
              LOG IN
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
