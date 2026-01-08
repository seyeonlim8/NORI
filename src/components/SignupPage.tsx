"use client";
import { useState } from "react";
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
  const [isResending, setIsResending] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusIsSuccess, setStatusIsSuccess] = useState(false);

  const passwordValidations = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    hasMinLength: password.length >= 6,
  };

  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };
  const emailValid = validateEmail(email);

  const usernameValid =
    username.length >= 4 &&
    username.length <= 19 &&
    /^[a-zA-Z0-9]+$/.test(username);

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
      setStatusMessage(null);
      setStatusIsSuccess(false);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setSignupComplete(true);
        setStatusMessage(
          "Account created! Please check your email to verify your account."
        );
        setStatusIsSuccess(true);
      } else {
        const data = await res.json();
        setStatusMessage(
          `Signup failed: ${data?.error || "Unknown error"}`
        );
        setStatusIsSuccess(false);
      }
    } catch (err) {
      console.error("Sign Up error: ", err);
      setStatusMessage("Something went wrong during signup.");
      setStatusIsSuccess(false);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleResendVerification = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage("Verification email resent! Please check your inbox.");
        setStatusIsSuccess(true);
      } else if (res.status === 429 && data.retryAfterSeconds) {
        setStatusMessage(data.error || "Please wait before resending.");
        setStatusIsSuccess(false);
      } else {
        setStatusMessage(
          data.error || "Failed to resend verification email."
        );
        setStatusIsSuccess(false);
      }
    } catch {
      setStatusMessage("Something went wrong. Please try again.");
      setStatusIsSuccess(false);
    } finally {
      setIsResending(false);
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

        {statusMessage && (
          <div
            data-testid="signup-status"
            className={`text-center text-sm font-semibold ${
              statusIsSuccess ? "text-green-600" : "text-red-500"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
            disabled={signupComplete}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {username.length > 0 && (
            <p data-testid="username-feedback" className="text-sm mt-[-2px]">
              {!usernameValid ? (
                <span className="text-red-500">
                  Username must be 4-19 characters, letters and numbers only.
                </span>
              ) : (
                <span className="text-green-600">Username looks good.</span>
              )}
            </p>
          )}
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            data-testid="email-input"
            disabled={signupComplete}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {email.length > 0 && (
            <p data-testid="email-feedback" className="text-sm mt-[-2px]">
              {!emailValid ? (
                <span className="text-red-500">Invalid email format.</span>
              ) : (
                <span className="text-green-600">Email looks good.</span>
              )}
            </p>
          )}
          {errors.email && !emailTouched && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
            disabled={signupComplete}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            data-testid="confirm-password-input"
            disabled={signupComplete}
            className="p-3 border rounded-md w-full mt-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p
              data-testid="confirm-pw-error"
              className="text-sm text-red-500 mt-1"
            >
              Passwords do not match.
            </p>
          )}
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
          <ul
            data-testid="password-checklist"
            className="text-sm mt-2 text-gray-600 space-y-1"
          >
            <li
              data-testid="pw-rule-uppercase"
              className={
                passwordValidations.hasUpperCase
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one uppercase letter
            </li>
            <li
              data-testid="pw-rule-lowercase"
              className={
                passwordValidations.hasLowerCase
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one lowercase letter
            </li>
            <li
              data-testid="pw-rule-number"
              className={
                passwordValidations.hasNumber
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one number
            </li>
            <li
              data-testid="pw-rule-special-char"
              className={
                passwordValidations.hasSpecialChar
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              • At least one special character
            </li>
            <li
              data-testid="pw-rule-length"
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
          data-testid="signup-btn"
          whileHover={{ scale: isPasswordStrong && !isSubmitting ? 1.05 : 1 }}
          whileTap={{ scale: isPasswordStrong && !isSubmitting ? 0.95 : 1 }}
          onClick={handleSubmit}
          disabled={
            !isPasswordStrong ||
            isSubmitting ||
            signupComplete ||
            !usernameValid ||
            !emailValid ||
            !passwordsMatch
          }
          className={`text-white font-bold py-3 rounded-md uppercase tracking-wide font-(family-name:--font-outfit) ${
            isPasswordStrong &&
            !isSubmitting &&
            usernameValid &&
            emailValid &&
            passwordsMatch
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          style={{ backgroundColor: "#F27D88" }}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </motion.button>

        {signupComplete && (
          <div className="text-center text-sm text-gray-600">
            <p>Didn&apos;t get the email?</p>
            <button
              data-testid="resend-verification-btn"
              onClick={handleResendVerification}
              disabled={isResending}
              className={`text-[#F27D88] font-bold hover:underline ${
                isResending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isResending
                ? "Resending verification email..."
                : "Resend verification email"}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-rose-500 hover:text-rose-600 font-semibold"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
