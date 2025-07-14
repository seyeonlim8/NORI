export default function HeroJLPT() {
  return (
    <div>
      <img className="w-full h-auto" src="cards.png" alt="Cards" />

      <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-44 pt-12 pb-60 flex flex-col justify-start items-center gap-10 mx-auto">
        <div className="w-full max-w-3xl flex flex-col justify-start items-center gap-5">
          <div className="text-center text-black text-6xl font-bold font-outfit leading-[61.60px]">
            Prep for JLPT.
          </div>
          <div className="text-center text-zinc-600 text-xl font-outfit leading-7 tracking-tight">
            Get ready for the JLPT with our customized flashcards for every
            level.
          </div>
        </div>
      </div>
    </div>
  );
}
