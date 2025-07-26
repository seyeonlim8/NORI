import { motion } from "framer-motion";
import { FloatingIcons } from "./FloatingIcons";

export default function HeroJoin() {
  return (
    <section className="relative w-full py-36 flex flex-col items-center text-center overflow-hidden">
      <FloatingIcons count={15} />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [1, 0.92, 1], // 너무 많이 안 줄어들게 조정
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut", // 부드럽게 이어짐
          repeatType: "mirror", // 튀는 지점 없이 왕복
        }}
        className="text-4xl md:text-5xl font-bold font-outfit text-gray-800 relative z-10"
      >
        Ready to Start Learning?
      </motion.h2>

      {/* CTA Button */}
      <motion.a
        href="/signup"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-10 py-4 bg-[#F27D88] text-white font-bold rounded-full shadow-lg hover:shadow-rose-300 transition relative z-10"
      >
        Sign Up for Free
      </motion.a>
    </section>
  );
}
