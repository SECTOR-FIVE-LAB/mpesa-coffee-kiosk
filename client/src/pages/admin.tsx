import React from "react";
import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getToken, saveToken } from "@/lib/api";

export default function AdminPage() {
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    saveToken("");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header openAuthModal={() => {}} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex-grow">
        <AdminPanel />
      </main>
      <Footer />
    </div>
  );
} 