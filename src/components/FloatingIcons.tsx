"use client";
import { motion } from "framer-motion";
import { BookOpen, Pencil, Star, Heart, Laugh } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";

interface FloatingIconsProps {
  count?: number;
  colors?: string[];
  icons?: ReactElement[];
}

const DEFAULT_COLORS = ["text-rose-300", "text-orange-300"];
const DEFAULT_ICONS = [
  <BookOpen key="book" />,
  <Pencil key="pencil" />,
  <Star key="star" />,
  <Heart key="heart" />,
  <Laugh key="laugh" />,
];

export function FloatingIcons({
  count = 30,
  colors = DEFAULT_COLORS,
  icons = DEFAULT_ICONS,
}: FloatingIconsProps) {
  const [positions, setPositions] = useState<
    { left: string; top: string; size: string; color: string; icon: ReactElement; delay: number; duration: number }[]
  >([]);

  // 한 번만 실행해서 랜덤 값 생성 (SSR-safe)
  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => {
      const icon = icons[i % icons.length];
      const size = 100 + Math.random() * 80;

      const baseLeft = (i * 12) % 100;
      const baseTop = (i % 3) * 30 + 10;

      const offsetLeft = baseLeft + (Math.random() * 6 - 3);
      const offsetTop = baseTop + (Math.random() * 8 - 4);

      return {
        left: `${offsetLeft}%`,
        top: `${offsetTop}%`,
        size: `${size}px`,
        color: colors[i % colors.length],
        icon,
        delay: Math.random() * 2,
        duration: 6 + Math.random() * 4,
      };
    });

    setPositions(generated);
  }, [count, colors, icons]);

  return (
    <>
      {positions.map(({ left, top, size, color, icon, delay, duration }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color} opacity-80 z-0`}
          style={{
            left,
            top,
            fontSize: size,
            pointerEvents: "none",
          }}
          animate={{ y: ["0%", "-40%", "0%"], rotate: [0, 40, -40, 0] }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: "mirror",
            delay,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </>
  );
}
