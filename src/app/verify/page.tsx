"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
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
      .then((res) => (res.ok ? setStatus("success") : setStatus("error")))
      .catch(() => setStatus("error"));
  }, [token]);

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
