"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col justify-start items-center overflow-hidden">
      <Header />

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg mt-24 p-10 flex flex-col gap-6"
      >
        <h2
          className="text-3xl text-center font-bold font-(family-name:--font-outfit)"
          style={{ color: "#F27D88" }}
        >
          Login to NORI
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white font-bold py-3 rounded-md uppercase tracking-wide font-(family-name:--font-outfit)"
          style={{ backgroundColor: "#F27D88" }}
        >
          Log In
        </motion.button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600 font-medium">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="text-[#F27D88] font-bold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
