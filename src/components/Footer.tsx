export default function Footer() {
  return (
    <div className="w-full max-w-screen-xl p-4 sm:p-8 flex justify-between items-center overflow-hidden mx-auto">
      <img className="w-43 h-15" src="nori-logo-w-text.png" />
      <div className="flex justify-end items-center gap-6">
        <div className="w-6 h-6 bg-black/40 rounded-full" />
        <div className="w-6 h-6 bg-white rounded-full" />
        <div className="w-6 h-6 bg-black/40 rounded-full" />
      </div>
    </div>
  );
}
