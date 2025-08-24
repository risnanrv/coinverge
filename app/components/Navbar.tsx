"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import LoginModal from "./loginmodel";
import { useAuthStore } from "@/lib/store/authStore";
import { signOut } from "next-auth/react";
import { usePortfolioStore } from "@/lib/store/portfolioStore";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPortfolio = pathname.startsWith("/portfolio");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Zustand stores
  const { session, isAuthenticated, isLoading } = useAuthStore();
  const { coins } = usePortfolioStore();

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="w-full bg-[#161731] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo (left) */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold cursor-pointer">
              <span className="bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent">
                Coinverge
              </span>
            </Link>
          </div>

          {/* Center nav links (desktop only) */}
          <nav className="hidden md:flex gap-10 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className={`text-white hover:text-[#337dc9] text-base font-medium transition ${
                isHome ? "underline underline-offset-4 decoration-2 decoration-[#337dc9]" : ""
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/portfolio"
                className={`text-white hover:text-[#337dc9] text-base font-medium transition ${
                  isPortfolio ? "underline underline-offset-4 decoration-2 decoration-[#337dc9]" : ""
                }`}
              >
                Portfolio{" "}
                {coins.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#337dc9] rounded-full text-xs font-semibold text-white">
                    {coins.length}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* User section (right) */}
          <div className="flex items-center gap-4 relative">
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-[#337dc9] border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-white bg-[#23234d] hover:bg-[#2a2a5a] focus-visible:ring-2 focus-visible:ring-white focus:outline-none transition"
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      loading="lazy"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold uppercase text-white">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden sm:block truncate max-w-[120px]">
                    {session?.user?.name || session?.user?.email?.split("@")[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-[#8638b4] to-[#337dc9] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus:outline-none transition"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav (below main row) */}
        <div className="md:hidden flex flex-col pt-3 pb-2">
          {isHome && isAuthenticated && (
            <div className="flex justify-end pr-4">
              <Link href="/portfolio" className="text-white font-medium py-1 hover:text-[#337dc9] transition">
                Portfolio {coins.length > 0 && `(${coins.length})`} <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
          {isPortfolio && (
            <div className="flex justify-start pl-4">
              <Link href="/" className="text-white font-medium py-1 hover:text-[#337dc9] transition">
                <span aria-hidden="true">←</span> Home
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
