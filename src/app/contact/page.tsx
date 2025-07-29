"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingIcons } from "@/components/FloatingIcons";

export default function ContactPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const fireConfettiAroundButton = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x, y },
      colors: ["#86efac", "#34d399", "#10b981"], 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.username = "Username is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!message) newErrors.message = "Message is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setStatus("");
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, message }),
    });

    setLoading(false);
    if (res.ok) {
      setStatus("success");
      setUsername("");
      setEmail("");
      setMessage("");

      fireConfettiAroundButton();
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-rose-100 via-orange-100 to-rose-50">
      <FloatingIcons count={15} />
      <Header />
      <main className="flex flex-col flex-grow items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-lg flex flex-col gap-6"
        >
          <h1 className="text-3xl font-bold text-center text-[#F27D88] font-outfit">
            Contact Us
          </h1>
          <p className="text-gray-600 text-center">
            Please use the form below if you have any questions or feedback!
          </p>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Name */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-400 focus:ring-red-300"
                    : "border-rose-200 focus:ring-rose-300"
                }`}
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-300"
                    : "border-rose-200 focus:ring-rose-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`border rounded-lg px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 ${
                  errors.message
                    ? "border-red-400 focus:ring-red-300"
                    : "border-rose-200 focus:ring-rose-300"
                }`}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              ref={buttonRef}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#F27D88] text-white font-bold rounded-lg shadow-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>

          {/* Status Messages */}
          {status === "success" && (
            <p className="text-green-700 text-center mt-2">
              Message sent! Thank you.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 text-center mt-2">
              Failed to send message. Please try again🥺
            </p>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
