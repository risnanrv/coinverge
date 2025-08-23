// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginModal from "./loginmodel";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPortfolio = pathname.startsWith("/portfolio");

  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="w-full bg-[#161731]">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo (left) */}
          <div className="flex items-center">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent">
              Coinverge
            </span>
          </div>

          {/* Center nav links (desktop only) */}
          <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className={`text-white hover:text-[#337dc9] text-sm font-medium transition ${
                isHome ? "underline" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              className={`text-white hover:text-[#337dc9] text-sm font-medium transition ${
                isPortfolio ? "underline" : ""
              }`}
            >
              Portfolio
            </Link>
          </div>

          {/* Login button (right) */}
          <div className="flex items-center">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-[#8638b4] to-[#337dc9] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus:outline-none transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile nav (below main row) */}
        <div className="md:hidden flex flex-col">
          {isHome && (
            <div className="flex justify-end pr-4">
              <Link href="/portfolio" className="text-white font-medium py-1">
                Portfolio <span aria-hidden>→</span>
              </Link>
            </div>
          )}

          {isPortfolio && (
            <div className="flex justify-start pl-4">
              <Link href="/" className="text-white font-medium py-1">
                <span aria-hidden>←</span> Home
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
