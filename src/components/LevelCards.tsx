"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionLink = motion(Link);

export default function LevelCards({
  levels,
  basePath, 
}: {
  levels: string[];
  basePath: string;
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {[levels.slice(0, 2), levels.slice(2)].map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-8">
          {row.map((level, index) => (
            <MotionLink
              key={level}
              href={`/${basePath}/${level.toLowerCase()}`} // basePath 활용
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: rowIndex * 0.2 + index * 0.1,
                duration: 0.4,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-44 h-36 flex items-center justify-center rounded-2xl bg-white border border-rose-200 shadow-sm
                         hover:border-rose-400 hover:bg-rose-50 transition-all duration-300 text-3xl font-bold text-[#F27D88] font-outfit"
            >
              {level}
            </MotionLink>
          ))}
        </div>
      ))}
    </div>
  );
}
