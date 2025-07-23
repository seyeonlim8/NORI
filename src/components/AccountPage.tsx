"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password validation states
  const passwordValidations = {
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[^A-Za-z0-9]/.test(newPassword),
    hasMinLength: newPassword.length >= 8,
  };
  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);

  // Load user info
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const updateAccount = async () => {
    setError("");
    setMessage("");

    if (newPassword && !isPasswordStrong) {
      setError("Password does not meet the requirements.");
      return;
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: newUsername || undefined,
        password: newPassword || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setNewUsername("");
      setNewPassword("");
      setMessage("Account updated successfully.");

      // Reload to update displayed username
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setError("Failed to update account.");
    }
  };

  const deleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    const res = await fetch("/api/user", {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("Account deleted.");
      window.location.href = "/";
    }
  };

  if (loading) return <div className="text-center mt-40">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 via-orange-100 to-rose-50 flex flex-col items-center">
      <Header />
      <div className="flex flex-col w-full max-w-2xl mt-32 px-6 gap-8 bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#F27D88] text-center font-outfit">
          My Account
        </h1>

        {/* Username Section */}
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Username</label>
          <p className="text-gray-500">Current username: {user?.username}</p>
          <p className="text-xs text-gray-400">
            Enter a new username to update your profile.
          </p>
          <input
            type="text"
            placeholder="New username"
            className="border border-rose-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>

        {/* Password Section */}
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Password</label>
          <p className="text-xs text-gray-400">
            Update your password below. Must meet all strength requirements.
          </p>
          <input
            type="password"
            placeholder="New password"
            className="border border-rose-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {/* Password Rules */}
          {newPassword && (
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
                  passwordValidations.hasSpecialChar
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                • At least one special character
              </li>
              <li
                className={
                  passwordValidations.hasMinLength
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                • Minimum 8 characters
              </li>
            </ul>
          )}
        </div>

        {/* Email Section */}
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Email</label>
          <p className="text-gray-500">Current email: {user?.email}</p>
          <button className="self-end bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-lg transition">
            Change Email (Coming Soon)
          </button>
        </div>

        {/* Save & Delete Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={updateAccount}
            className="px-6 py-3 rounded-lg bg-[#F27D88] text-white font-bold hover:scale-105 transition-transform"
          >
            Save Changes
          </button>
          <button
            onClick={deleteAccount}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Delete Account
          </button>
        </div>

        {/* Messages */}
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        {message && (
          <p className="text-center text-green-500 mt-2">{message}</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
