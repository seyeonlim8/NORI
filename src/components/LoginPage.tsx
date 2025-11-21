"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./Header";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success message
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/"; // redirect to main by default

  useEffect(() => {
    const lockoutEnd = localStorage.getItem("lockoutEnd");
    const currentTime = Date.now();

    if (lockoutEnd && currentTime < Number(lockoutEnd)) {
      setIsLocked(true);
      const remainingTime = Number(lockoutEnd) - currentTime;
      const minutes = Math.ceil(remainingTime / 60000);
      setError(`Login is unavailable for ${minutes} minutes.`);
    } else {
      setIsLocked(false);
      setAttemptsLeft(Number(localStorage.getItem("attemptsLeft")) || 5);
    }
  }, []);

  const handleLogin = async () => {
    if (isLocked) return;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setError(null);
    setIsSuccess(false);
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
          setAttemptsLeft((prev) => {
            const newAttempts = prev - 1;
            localStorage.setItem("attemptsLeft", newAttempts.toString());
            if (newAttempts <= 0) {
              const lockoutDuration = 15 * 60 * 1000; // 15 minutes
              localStorage.setItem(
                "lockoutEnd",
                (Date.now() + lockoutDuration).toString()
              );
              setIsLocked(true);
              const remainingTime = Math.ceil(lockoutDuration / 60000); // Convert to minutes
              setError(
                `Too many attempts. Please try again later.\nRemaining lockout time: ${remainingTime} minutes.`
              );
            }
            return newAttempts;
          });
          setError(
            (prev) =>
              `Invalid email or password. ${attemptsLeft - 1} attempts remaining. ${prev || ""}`
          );
        } else if (res.status === 403 && data.needsVerification) {
          setNeedsVerification(true); // Set state to show resend verification button
          setError(data.error); // Show the error message
        } else {
          setError(data.error || "Login failed. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // Redirect to previous page after login
      localStorage.removeItem("attemptsLeft"); // Reset attempts on successful login
      localStorage.removeItem("lockoutEnd");
      router.push(redirectTo);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setError("Verification email resent! Please check your inbox.");
        setIsSuccess(true); // Set success state
      } else {
        setError(data.error || "Failed to resend verification email.");
        setIsSuccess(false); // Reset success state
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSuccess(false); // Reset success state
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
          <div
            data-testid="credentials-error"
            className={`text-center text-sm font-semibold ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
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
          data-testid="login-btn"
          whileHover={!isLocked && !isSubmitting ? { scale: 1.05 } : {}}
          whileTap={!isLocked && !isSubmitting ? { scale: 0.95 } : {}}
          disabled={isSubmitting || isLocked}
          onClick={handleLogin}
          className={`text-white font-bold py-3 rounded-md uppercase tracking-wide font-(family-name:--font-outfit) ${
            isSubmitting || isLocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F27D88]"
          }`}
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

        {/* Resend verification button - shown only if login fails due to unverified email */}
        {needsVerification && (
          <div className="mt-4">
            <p className="text-center text-sm text-gray-600">
              Your email is not verified.{" "}
              <button
                data-testid="resend-verification-btn"
                onClick={handleResendVerification}
                className="text-[#F27D88] font-bold hover:underline"
              >
                Resend verification email
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
