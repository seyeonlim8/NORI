import QuizTypePage from "@/components/QuizType";

export default async function QuizTypeRoute({
  params,
}: {
  params: { level: string };
}) {
  const { level } = params; // URL에서 레벨 추출
  return <QuizTypePage level={level.toUpperCase()} />;
}
