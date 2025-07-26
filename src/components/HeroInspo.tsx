import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroInspo() {
  const [count, setCount] = useState(0);
  const target = 300;

  // Count up effect
  useEffect(() => {
    let current = 0;
    const step = target / 100;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, 25);
    return () => clearInterval(timer);
  }, []);

  const days = Array.from({ length: 30 });

  return (
    <section className="relative w-full py-36 px-6 bg-gradient-to-r from-rose-200 via-orange-100 to-rose-200 flex flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold font-outfit text-gray-800 mb-10 flex flex-col items-center gap-3"
      >
        {/* Icon */}
        <motion.div
          animate={{
            y: [0, -8, 0], // float
            scale: [1, 1.05, 1], // zoom in/out
            filter: [
              "drop-shadow(0 0 0px rgba(242,125,136,0.5))",
              "drop-shadow(0 0 10px rgba(242,125,136,0.8))",
              "drop-shadow(0 0 0px rgba(242,125,136,0.5))",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <CalendarDays className="w-14 h-14 text-rose-400" />
        </motion.div>
        {/* Title */}
        Build Consistency, See Results
      </motion.h2>

      {/* Circles */}
      <div className="grid grid-cols-7 gap-3 mb-10">
        {days.map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03, duration: 0.3 }}
            className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-300 to-orange-200 shadow-lg"
          />
        ))}
      </div>

      {/* Sub text */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-5xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent mt-6"
      >
        {count}+ Words
      </motion.div>

      <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-lg">
        Learn just 10 words a day — that’s 300 words in a month. Stay on track
        and watch your knowledge grow!
      </p>
    </section>
  );
}
