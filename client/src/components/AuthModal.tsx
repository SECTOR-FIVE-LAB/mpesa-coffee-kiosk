// client/src/components/AuthModal.tsx
import React from "react";
import AuthForm from "./AuthForm";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-8 rounded-xl shadow-2xl min-w-[340px] max-w-full w-full sm:w-[380px] border border-coffee relative">
        <button
          className="absolute top-3 right-3 text-coffee hover:text-coffee-dark text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-coffee mb-4 text-center">Welcome</h2>
        <AuthForm onSuccess={onClose} />
      </div>
    </div>
  );
}