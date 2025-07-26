"use client";
import { FloatingIcons } from "@/components/FloatingIcons";
import QuizTypePage from "@/components/QuizType";

export default async function QuizTypeRoute({
  params,
}: {
  params: { level: string };
}) {
  const { level } = params; // URL에서 레벨 추출
  return (
    <div>
      <FloatingIcons count={15} />
      <QuizTypePage level={level.toUpperCase()} />;
    </div>
  );
}
