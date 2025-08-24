"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginModal from "./loginmodel";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // The user will be redirected to the portfolio after successful login
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161731] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#337dc9] mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-[#161731] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent mb-4">
              Access Required
            </h1>
            <p className="text-gray-300 mb-6">
              You need to be logged in to view your portfolio. Please sign in with your Google account.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#8638b4] to-[#337dc9] text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Sign In
            </button>
          </div>
        </div>
        {showLoginModal && (
          <LoginModal 
            onClose={handleCloseModal} 
            onSuccess={handleLoginSuccess}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
