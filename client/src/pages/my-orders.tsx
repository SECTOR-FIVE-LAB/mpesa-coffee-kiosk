import React from "react";
import MyOrders from "@/components/MyOrders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MyOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header openAuthModal={() => {}} />
      <main className="flex-grow">
        <MyOrders />
      </main>
      <Footer />
    </div>
  );
} 