export default function Footer() {
  return (
    <footer className="w-full mt-20">
      <div className="w-full max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-700 font-outfit">
        {/* Logo + Description */}
        <div className="flex flex-col gap-4">
          <img src="/nori-logo-w-text.png" alt="Nori Logo" className="w-40" />
          <p className="text-sm max-w-xs">
            NORI is a smart learning platform for JLPT preparation with
            flashcards, quizzes, and sentence practice.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Explore</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="/about" className="hover:text-rose-500 transition">
                About
              </a>
            </li>
            <li>
              <a
                href="/study/flashcards"
                className="hover:text-rose-500 transition"
              >
                Flashcards
              </a>
            </li>
            <li>
              <a href="/study/quiz" className="hover:text-rose-500 transition">
                Quizzes
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-rose-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Newsletter</h3>
          <p className="text-sm mb-4">
            Get study tips and updates straight to your inbox.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-md bg-white border border-gray-300 focus:outline-none focus:border-rose-400 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-400 text-white text-sm font-bold rounded-r-md hover:bg-rose-500 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {[
              {
                href: "#",
                label: "LinkedIn",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.5 20h-3v-11h3v11zm-1.5-12.4c-.97 0-1.75-.78-1.75-1.75S5.03 4.1 6 4.1 7.75 4.88 7.75 5.85 6.97 7.6 6 7.6zM20 20h-3v-5.5c0-1.38-.03-3.15-1.92-3.15-1.92 0-2.22 1.5-2.22 3.05V20h-3v-11h2.88v1.5h.04c.4-.75 1.36-1.54 2.8-1.54 3 0 3.56 1.97 3.56 4.54V20z" />
                  </svg>
                ),
              },
              {
                href: "#",
                label: "GitHub",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .3c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.7.4-1.1.7-1.4-2.7-.3-5.5-1.4-5.5-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.9 1.2 2 1.2 3.4 0 4.7-2.8 5.8-5.5 6.1.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.7 18.6.3 12 .3z" />
                  </svg>
                ),
              },
              {
                href: "#",
                label: "Instagram",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zm4.5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5-2a1 1 0 110 2 1 1 0 010-2z" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }, i) => (
              <a
                key={i}
                href={href}
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow transition transform hover:scale-110 hover:shadow-[0_0_15px_rgba(242,125,136,0.6)]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="pt-6 text-center text-xs text-gray-500 font-outfit mb-10">
        © 2025 NORI. All rights reserved. |
        <a href="/privacy" className="hover:text-rose-400">
          {" "}
          Privacy Policy
        </a>{" "}
        |
        <a href="/terms" className="hover:text-rose-400">
          {" "}
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
