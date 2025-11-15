import QuizPage from "@/components/QuizPage";

export default async function QuizRoute({
  params,
}: {
  params: Promise<{ level: string; type: string }>;
}) {
  const { level, type } = await params;
  return <QuizPage level={level} type={type.toLowerCase()} />;
}
