import FlashcardsPage from "@/components/FlashcardsPage";

export default async function FlashcardsRoute({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;  
  return <FlashcardsPage level={level} />;
}
