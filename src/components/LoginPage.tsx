"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./Header";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/"; // redirect to main by default

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 || res.status === 404) {
          setError("Invalid email or password.");
        } else if (res.status === 403) {
          setError("Please verify your email before logging in.");
        } else {
          setError(data.error || "Login failed. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // redirect to previous page after login
      router.push(redirectTo);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

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

        {error && (
          <div className="text-center text-red-500 text-sm font-semibold">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
          onClick={handleLogin}
          className="text-white font-bold py-3 rounded-md uppercase tracking-wide font-(family-name:--font-outfit)"
          style={{ backgroundColor: "#F27D88" }}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
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
