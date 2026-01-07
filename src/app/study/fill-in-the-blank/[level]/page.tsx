import FillInTheBlankPage from "@/components/FillInTheBlankPage";

export default async function FlashcardsRoute({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  return <FillInTheBlankPage level={level} />;
}
