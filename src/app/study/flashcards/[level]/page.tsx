import FlashcardsPage from "@/components/FlashcardsPage";

export default async function FlashcardsRoute({
  params,
}: {
  params: { level: string };
}) {
  const { level } = await params; 
  return <FlashcardsPage level={level.toUpperCase()} />;
}
