"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "expired"
  >("pending");
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Executed when value of 'token' changes.
  useEffect(() => {
    if (typeof token !== "string") {
      setStatus("error");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          return;
        }
        let data: { error?: string } | null = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        if (res.status === 410 || data?.error === "expired") {
          setStatus("expired");
          return;
        }
        setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const handleResend = async () => {
    if (!resendEmail || isResending) return;
    setIsResending(true);
    setResendMessage(null);
    setResendSuccess(false);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendSuccess(true);
        setResendMessage("Verification email resent! Please check your inbox.");
      } else {
        setResendSuccess(false);
        setResendMessage(data.error || "Failed to resend verification email.");
      }
    } catch {
      setResendSuccess(false);
      setResendMessage("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-100 to-orange-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#F27D88] mb-4">Email Verification</h2>

        {status === "pending" && (
          <p className="text-gray-700 text-base">Verifying your email...</p>
        )}
        {status === "success" && (
          <p className="text-green-600 text-base">
            🎉 Your email has been successfully verified!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-base">
            ❌ Invalid or expired verification link.
          </p>
        )}
        {status === "expired" && (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-red-500 text-base">
              Verification link expired. Request a new verification email.
            </p>
            <div className="w-full flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                onClick={handleResend}
                disabled={isResending}
                className={`w-full py-3 rounded-md text-white font-bold ${
                  isResending ? "bg-gray-400 cursor-not-allowed" : "bg-[#F27D88]"
                }`}
              >
                {isResending ? "Resending..." : "Resend verification email"}
              </button>
              {resendMessage && (
                <p
                  className={`text-sm font-semibold ${
                    resendSuccess ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {resendMessage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center mt-40">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
