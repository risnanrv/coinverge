"use client";
import { signIn } from "next-auth/react"
import React from "react";

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/10 dark:bg-black/10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-sm w-full shadow-lg relative"
        tabIndex={-1}
      >
        <h2
          id="login-modal-title"
          className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-[#8638b4] to-[#337dc9] bg-clip-text text-transparent"
        >
          Welcome Back
        </h2>
        <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
          Continue with your Google account to access Coinverge.
        </p>
        <button
          onClick={async () => {
            try {
              await signIn("google", { callbackUrl: "/portfolio" });
              onSuccess?.();
            } catch (error) {
              console.error("Sign in error:", error);
            }
          }}
          className="w-full flex items-center justify-center space-x-3 border border-gray-400 rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus:outline-none transition"
        >
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Continue with Google
          </span>
        </button>
        <button
          onClick={onClose}
          aria-label="Close login modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 rounded"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
