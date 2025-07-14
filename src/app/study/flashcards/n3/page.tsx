import FlashcardsPage from "@/components/FlashcardsPage";
import { dummyCards } from "@/data/dummyCards";

export default function Flashcards() {
  const n3Cards = dummyCards.filter((card) => card.level === "N3");
  return <FlashcardsPage cards={n3Cards} />;
}