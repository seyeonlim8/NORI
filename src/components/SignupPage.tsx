"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./Header";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const passwordValidations = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasMinLength: password.length >= 6,
  };

  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required";
    else if (!isPasswordStrong)
      newErrors.password = "Password does not meet all requirements";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Signup successful!");
      // CALL API HERE
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col justify-start items-center overflow-hidden">
      <Header />

      {/* Signup Form */}
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
          Create Your NORI Account
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
          <ul className="text-sm mt-2 text-gray-600 space-y-1">
            <li
              className={
                passwordValidations.hasUpperCase
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one uppercase letter
            </li>
            <li
              className={
                passwordValidations.hasLowerCase
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one lowercase letter
            </li>
            <li
              className={
                passwordValidations.hasNumber
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one number
            </li>
            <li
              className={
                passwordValidations.hasMinLength
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • Minimum 6 characters
            </li>
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: isPasswordStrong ? 1.05 : 1 }}
          whileTap={{ scale: isPasswordStrong ? 0.95 : 1 }}
          onClick={handleSubmit}
          disabled={!isPasswordStrong}
          className={`text-white font-bold py-3 rounded-md uppercase tracking-wide font-(family-name:--font-outfit) ${
            isPasswordStrong
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          style={{ backgroundColor: "#F27D88" }}
        >
          Sign Up
        </motion.button>

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#F27D88] font-bold hover:underline"
          >
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
