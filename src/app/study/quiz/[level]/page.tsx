import { FloatingIcons } from "@/components/FloatingIcons";
import QuizTypePage from "@/components/QuizType";

export default async function QuizTypeRoute({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  return (
    <div>
      <FloatingIcons count={10} />
      <QuizTypePage level={level} />
    </div>
  );
}
