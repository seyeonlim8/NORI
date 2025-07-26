import { motion } from "framer-motion";
import { FloatingIcons } from "./FloatingIcons";

export default function HeroJoin() {
  return (
    <section className="relative w-full py-36 flex flex-col items-center text-center overflow-hidden">
      <FloatingIcons count={25} />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold font-outfit text-gray-800 relative z-10"
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
