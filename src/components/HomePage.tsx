"use client";
import Footer from "./Footer";
import Header from "./Header";
import HeroBlank from "./HeroBlank";
import HeroFlashcard from "./HeroFlashcard";
import HeroInspo from "./HeroInspo";
import HeroJoin from "./HeroJoin";
import HeroMain from "./HeroMain";
import HeroQuiz from "./HeroQuiz";

export default function HomePage() {
  return (
    <div className="w-full bg-gradient-to-b from-rose-100 to-orange-200 flex flex-col justify-start items-center overflow-hidden">
      <Header />

      <HeroMain />
      <HeroFlashcard />
      <HeroQuiz />
      <HeroBlank />
      <HeroInspo />
      <HeroJoin />

      <Footer />
    </div>
  );
}
