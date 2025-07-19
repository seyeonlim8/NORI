import FlashcardsPage from "@/components/FlashcardsPage";
import { dummyCards } from "@/data/dummyCards";

export default function Flashcards() {
  const n1Cards = dummyCards.filter((card) => card.level === "N1");
  return <FlashcardsPage cards={n1Cards} />;
}