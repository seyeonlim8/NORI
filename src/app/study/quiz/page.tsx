"use client";
import { FloatingIcons } from "@/components/FloatingIcons";
import QuizLevel from "@/components/QuizLevel";

export default function SelectQuizLevel() {
  return (
    <div>
      <FloatingIcons count={10} />
      <QuizLevel />
    </div>
  );
}
