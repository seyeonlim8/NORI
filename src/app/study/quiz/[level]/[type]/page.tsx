import QuizPage from "@/components/QuizPage";

export default async function QuizRoute({
  params,
}: {
  params: { level: string; type: string };
}) {
  const { level, type } = await params;

  return <QuizPage level={level.toUpperCase()} type={type.toLowerCase()} />;
}
