"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        }
      } catch (err) {
        setUsername(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    setUsername(null);
    router.push("/login");
  };

  return (
    <div className="w-full max-w-screen-xl p-1 sm:p-1 flex justify-between items-center mx-auto border-b border-red-800 relative z-50">
      <Link href="/">
        <img className="w-43 h-15 cursor-pointer" src="/nori-logo-w-text.png" />
      </Link>

      <div className="flex justify-end items-center gap-6">
        {/* STUDY with dropdown */}
        <div className="relative group cursor-pointer z-50">
          <motion.div
            whileHover={{ scale: 1.05, color: "#F27D88" }}
            whileTap={{ scale: 0.95 }}
            className="text-stone-800 text-sm font-bold uppercase leading-tight tracking-tight font-outfit"
          >
            STUDY
          </motion.div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
            <ul className="py-2">
              {[
                { label: "Flashcards", href: "/study/flashcards" },
                { label: "Quiz", href: "/study/quiz" },
                {
                  label: "Fill in the blank",
                  href: "/study/fill-in-the-blank",
                },
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

        {/* ABOUT */}
        <Link href="/about">
          <motion.div
            whileHover={{ scale: 1.05, color: "#F27D88" }}
            whileTap={{ scale: 0.95 }}
            className="relative text-stone-800 text-sm font-bold uppercase leading-tight tracking-tight font-outfit cursor-pointer z-50 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-rose-400 hover:after:w-full after:transition-all after:duration-300"
          >
            ABOUT
          </motion.div>
        </Link>

        {/* CONTACT */}
        <Link href="/contact">
          <motion.div
            whileHover={{ scale: 1.05, color: "#F27D88" }}
            whileTap={{ scale: 0.95 }}
            className="relative text-stone-800 text-sm font-bold uppercase leading-tight tracking-tight font-outfit cursor-pointer z-50 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-rose-400 hover:after:w-full after:transition-all after:duration-300"
          >
            CONTACT
          </motion.div>
        </Link>

        {/* 로그인 상태 */}
        {username ? (
          <div className="relative group cursor-pointer z-50">
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "#F27D88" }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-rose-300 text-white rounded-md font-bold text-sm font-outfit"
            >
              Hello, {username}
            </motion.div>

            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
              <ul className="py-2">
                <li>
                  <Link href="/account">
                    <div className="px-5 py-3 text-sm text-gray-700 hover:bg-rose-100 hover:text-rose-500 transition font-outfit">
                      My Account
                    </div>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-rose-100 hover:text-rose-500 transition font-outfit"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05, backgroundColor: "#F27D88" }}
            whileTap={{ scale: 0.95 }}
            className="px-3 pt-2 pb-1.5 bg-orange-300 rounded flex justify-center items-center gap-2.5 cursor-pointer relative z-50"
          >
            <Link href="/login">
              <div className="text-yellow-50 text-base font-bold uppercase leading-tight tracking-tight font-outfit">
                LOG IN
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
