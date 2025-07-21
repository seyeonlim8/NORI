import FlashcardsPage from "@/components/FlashcardsPage";

export default async function FlashcardsRoute({
  params,
}: {
  params: { level: string };
}) {
  const { level } = await params; // params를 await
  return <FlashcardsPage level={level.toUpperCase()} />;
}
