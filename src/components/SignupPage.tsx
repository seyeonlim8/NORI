"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./Header";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const router = useRouter();

  const passwordValidations = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasMinLength: password.length >= 6,
  };

  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const emailValid = validateEmail(email);

  const usernameValid =
    username.length >= 4 &&
    username.length <= 19 &&
    /^[a-zA-Z0-9]+$/.test(username); 

  useEffect(() => {
    if (!usernameValid) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameCheckLoading(true);
    const controller = new AbortController();
    fetch(`/api/auth/signup?username=${encodeURIComponent(username)}`, {
      method: "GET",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        setUsernameAvailable(res.ok && data.available);
      })
      .catch(() => setUsernameAvailable(null))
      .finally(() => setUsernameCheckLoading(false));
    return () => controller.abort();
  }, [username, usernameValid]);

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required";
    else if (!isPasswordStrong)
      newErrors.password = "Password does not meet all requirements";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsSubmitting(true); // Start loading

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        alert("✅ Please check your email to verify your account.");
      } else {
        const data = await res.json();
        alert(`❌ Signup failed: ${data?.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Sign Up error: ", err);
      alert("❌ Something went wrong during signup.");
    } finally {
      setIsSubmitting(false); // Stop loading
      router.push("/login"); // Redirect to login page
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

        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {username.length > 0 && (
            <p className="text-sm">
              {!usernameValid ? (
                <span className="text-red-500">
                  Username must be 4-19 characters, letters and numbers only.
                </span>
              ) : usernameCheckLoading ? (
                <span className="text-gray-500">Checking username...</span>
              ) : usernameAvailable === false ? (
                <span className="text-red-500">
                  Username is already in use.
                </span>
              ) : usernameAvailable === true ? (
                <span className="text-green-600">Username available!</span>
              ) : null}
            </p>
          )}
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        {email.length > 0 && !emailValid && (
          <p className="text-sm text-red-500 mt-[-20px]">
            Invalid email format.
          </p>
        )}
        {errors.email && !emailTouched && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border rounded-md w-full mt-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match.</p>
          )}
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
          whileHover={{ scale: isPasswordStrong && !isSubmitting ? 1.05 : 1 }}
          whileTap={{ scale: isPasswordStrong && !isSubmitting ? 0.95 : 1 }}
          onClick={handleSubmit}
          disabled={
            !isPasswordStrong ||
            isSubmitting ||
            !usernameValid ||
            usernameAvailable !== true ||
            !passwordsMatch
          }
          className={`text-white font-bold py-3 rounded-md uppercase tracking-wide font-(family-name:--font-outfit) ${
            isPasswordStrong &&
            !isSubmitting &&
            usernameValid &&
            usernameAvailable === true &&
            passwordsMatch
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          style={{ backgroundColor: "#F27D88" }}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
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
