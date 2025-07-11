export default function HeroBlank() {
  return (
    <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-16 pt-36 pb-12 bg-[radial-gradient(ellipse_41.64%_42.16%_at_50%_50%,_rgba(242.39,_124.69,_136.23,_0.62)_21%,_rgba(255,_255,_255,_0)_100%)] flex flex-col justify-center items-center overflow-hidden mx-auto">
      <div className="w-full flex flex-col justify-start items-center gap-6">
        <div className="text-black text-6xl font-bold font-(family-name:--font-outfit) leading-[61.60px]">
          Fill in the ____.
        </div>
        <div className="text-center text-zinc-600 text-xl font-(family-name:--font-outfit) leading-7 tracking-tight">
          Enhance your skills in grammar and vocabulary through engaging example
          sentences
        </div>
      </div>
      <img
        className="w-full max-w-3xl h-auto mt-10"
        src="fill-in-the-blank.png"
      />
    </div>
  );
}
