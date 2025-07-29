"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Label } from "recharts";
import Header from "./Header";
import Footer from "./Footer";

const COLORS = ["#F27D88", "#FDBA74", "#FDE68A", "#93C5FD", "#A5B4FC"];
const LEVELS = ["N1", "N2", "N3", "N4", "N5"];

type ProgressItem = {
  wordId: number;
  completed: boolean;
  level: string; // "N1" ~ "N5"
  type: string; // flashcard | quiz | fill
};

type SummaryResponse = {
  total: number;
  summary: { level: string; count: number }[];
};

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressData, setProgressData] = useState<{
    [key: string]: { overall: number; levels: number[] };
  }>({});
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"progress" | "account">(
    "progress"
  );

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

  // Calculate total progress
  useEffect(() => {
    const fetchProgress = async () => {
      setProgressLoading(true);
      const types = ["flashcard", "quiz", "fill"];

      const results = await Promise.all(
        types.map(async (type) => {
          const [progressRes, wordsRes] = await Promise.all([
            fetch(`/api/study-progress?type=${type}`, {
              credentials: "include",
            }),
            fetch(`/api/words?summary=true`, { credentials: "include" }),
          ]);

          const progress: ProgressItem[] = progressRes.ok
            ? await progressRes.json()
            : [];
          const wordsSummary: SummaryResponse = wordsRes.ok
            ? await wordsRes.json()
            : { total: 0, summary: [] };

          // Calculate total number of words & completed words
          const totalsByLevel: {
            [level: string]: { total: number; completed: number };
          } = {};
          wordsSummary.summary.forEach((w) => {
            totalsByLevel[w.level] = { total: w.count, completed: 0 };
          });

          progress.forEach((item) => {
            const lvl = item.level;
            if (!totalsByLevel[lvl]) {
              totalsByLevel[lvl] = { total: 0, completed: 0 };
            }
            if (item.completed) totalsByLevel[lvl].completed += 1;
          });

          // Calculate total progress
          const totalWords = wordsSummary.total || 0;
          const completedWords = Object.values(totalsByLevel).reduce(
            (acc, lvl) => acc + lvl.completed,
            0
          );
          const overall =
            totalWords > 0
              ? Math.round((completedWords / totalWords) * 100)
              : 0;

          // Progress by level
          const levels = LEVELS.map((lvl) => {
            const stats = totalsByLevel[lvl];
            return stats && stats.total
              ? Math.round((stats.completed / stats.total) * 100)
              : 0;
          });

          return { type, overall, levels };
        })
      );

      const mapped: { [key: string]: { overall: number; levels: number[] } } =
        {};
      results.forEach((r) => {
        mapped[r.type] = { overall: r.overall, levels: r.levels };
      });
      setProgressData(mapped);
      setProgressLoading(false);
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="text-center mt-40">Loading...</div>;

  // PieChart
  const ProgressPie = ({
    percentage,
    size = 180,
    color = "#F27D88",
  }: {
    percentage: number;
    size?: number;
    color?: string;
  }) => {
    const data = [
      { name: "Completed", value: percentage },
      { name: "Remaining", value: 100 - percentage },
    ];
    return (
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          innerRadius={size * 0.3}
          outerRadius={size * 0.45}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? color : "#F3F4F6"} />
          ))}
          <Label
            value={`${percentage}%`}
            position="center"
            className="font-bold text-gray-700 text-lg"
          />
        </Pie>
      </PieChart>
    );
  };

  const renderProgressSection = (
    title: string,
    data?: { overall: number; levels: number[] }
  ) => {
    if (!data) return null;
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#F27D88] font-outfit">
          {title}
        </h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col items-center">
            <ProgressPie percentage={data.overall} size={180} />
            <p className="text-sm mt-2 text-gray-600">Total</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {data.levels.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <ProgressPie
                  percentage={val}
                  size={100}
                  color={COLORS[idx % COLORS.length]}
                />
                <p className="text-xs mt-1 text-gray-600">N{idx + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-100 via-orange-100 to-rose-50 flex flex-col items-center">
      <Header />

      {/* Tab UI */}
      <div className="mt-32 flex flex-col items-center w-full">
        <div className="flex relative gap-12 border-b border-gray-200 pb-2">
          {["progress", "account"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "progress" | "account")}
              className={`relative font-bold text-lg transition-colors ${activeTab === tab ? "text-[#F27D88]" : "text-gray-500 hover:text-[#F27D88]"}`}
            >
              {tab === "progress" ? "Study Progress" : "Account Settings"}
            </button>
          ))}
          <motion.div
            layoutId="tab-underline"
            className="absolute bottom-0 h-[2px] bg-[#F27D88]"
            initial={false}
            animate={{
              x: activeTab === "progress" ? -20 : 160,
              width: activeTab === "progress" ? 170 : 190,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Tab contents */}
      <div className="flex flex-col w-full max-w-4xl mt-10 px-6 gap-8">
        <AnimatePresence mode="wait">
          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-8"
            >
              {progressLoading ? (
                <p className="text-center text-gray-600">Loading progress...</p>
              ) : (
                <>
                  {renderProgressSection("Flashcards", progressData.flashcard)}
                  {renderProgressSection("Quizzes", progressData.quiz)}
                  {renderProgressSection(
                    "Fill-in-the-Blank",
                    progressData.fill
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-8 bg-white rounded-2xl shadow-lg p-8"
            >
              <h1 className="text-3xl font-bold text-[#F27D88] text-center font-outfit">
                My Account
              </h1>
              <div className="flex flex-col gap-3">
                <label className="font-semibold text-gray-700">Username</label>
                <p className="text-gray-500">
                  Current username: {user?.username}
                </p>
                <input
                  type="text"
                  placeholder="New username"
                  className="border border-rose-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  className="border border-rose-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && (
                  <ul className="text-sm mt-2 text-gray-600 space-y-1">
                    {Object.entries(passwordValidations).map(
                      ([rule, valid]) => (
                        <li
                          key={rule}
                          className={valid ? "text-green-600" : "text-red-500"}
                        >
                          {rule === "hasUpperCase" &&
                            "• At least one uppercase letter"}
                          {rule === "hasLowerCase" &&
                            "• At least one lowercase letter"}
                          {rule === "hasNumber" && "• At least one number"}
                          {rule === "hasSpecialChar" &&
                            "• At least one special character"}
                          {rule === "hasMinLength" && "• Minimum 8 characters"}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={async () => {
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
                      setTimeout(() => window.location.reload(), 1000);
                    } else {
                      setError("Failed to update account.");
                    }
                  }}
                  className="px-6 py-3 rounded-lg bg-[#F27D88] text-white font-bold hover:scale-105 transition-transform"
                >
                  Save Changes
                </button>
                <button
                  onClick={async () => {
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
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete Account
                </button>
              </div>
              {error && (
                <p className="text-center text-red-500 mt-2">{error}</p>
              )}
              {message && (
                <p className="text-center text-green-500 mt-2">{message}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
