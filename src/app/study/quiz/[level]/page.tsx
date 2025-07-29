"use client";
import { FloatingIcons } from "@/components/FloatingIcons";
import QuizTypePage from "@/components/QuizType";

export default async function QuizTypeRoute({
  params,
}: {
  params: { level: string };
}) {
  const { level } = params; // Get level from URL
  return (
    <div>
      <FloatingIcons count={10} />
      <QuizTypePage level={level.toUpperCase()} />;
    </div>
  );
}
