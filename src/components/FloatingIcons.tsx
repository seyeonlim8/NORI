import { motion } from "framer-motion";
import { BookOpen, Pencil, Star, Heart, Laugh } from "lucide-react";
import type { ReactElement } from "react";

interface FloatingIconsProps {
  count?: number;
  colors?: string[];
  icons?: ReactElement[]; 
}

export function FloatingIcons({
  count = 30,
  colors = ["text-rose-300", "text-orange-300"],
  icons = [<BookOpen />, <Pencil />, <Star />, <Heart />, <Laugh />],
}: FloatingIconsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const Icon = icons[i % icons.length];
        const size = 100 + Math.random() * 100;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className={`absolute ${color} opacity-80`}
            style={{
              left: `${2 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
              fontSize: `${size}px`,
            }}
            animate={{ y: ["0%", "-40%", "0%"], rotate: [0, 40, -40, 0] }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              repeatType: "mirror",
              delay: i * 0.5,
            }}
          >
            {Icon}
          </motion.div>
        );
      })}
    </>
  );
}
