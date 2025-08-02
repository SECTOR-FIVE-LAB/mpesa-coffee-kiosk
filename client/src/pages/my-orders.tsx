import React from "react";
import MyOrders from "@/components/MyOrders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getToken } from "@/lib/api";

export default function MyOrdersPage() {
  const isLoggedIn = !!getToken();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        openAuthModal={() => {}} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        <MyOrders />
      </main>
      <Footer />
    </div>
  );
} 