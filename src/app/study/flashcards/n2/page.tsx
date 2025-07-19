import FlashcardsPage from "@/components/FlashcardsPage";
import { dummyCards } from "@/data/dummyCards";

export default function Flashcards() {
  const n2Cards = dummyCards.filter((card) => card.level === "N2");
  return <FlashcardsPage cards={n2Cards} />;
}