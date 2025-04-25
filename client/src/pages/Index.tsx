
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoffeeCard from "@/components/CoffeeCard";
import PaymentModal from "@/components/PaymentModal";
import { coffeeProducts, CoffeeProduct } from "@/data/coffeeProducts";
import { Coffee } from "lucide-react";
import { Toaster } from "sonner";

const Index: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<CoffeeProduct | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const handleBuyClick = (product: CoffeeProduct) => {
    setSelectedProduct(product);
    setIsPaymentModalOpen(true);
  };
  
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-coffee-dark text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Fresh Coffee, <br />
                <span className="text-mpesa">Simple Payments</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Browse our selection of premium coffees and pay easily with M-PESA. No hassle, just great coffee.
              </p>
            </div>
          </div>
        </section>
        
        {/* Products section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-8">
            <Coffee className="h-8 w-8 text-coffee mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-center text-coffee">Our Coffee Selection</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coffeeProducts.map((product) => (
              <CoffeeCard 
                key={product.id} 
                product={product} 
                onBuy={handleBuyClick} 
              />
            ))}
          </div>
        </section>
        
        {/* Why Choose Us section */}
        <section className="coffee-pattern py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-coffee mb-10">Why Choose Coffee Kiosk?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-coffee-light/30 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-coffee-dark">Fast Service</h3>
                <p className="text-muted-foreground">Order and pay in seconds with our simple interface and M-PESA integration.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-coffee-light/30 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-coffee-dark">Secure Payments</h3>
                <p className="text-muted-foreground">Pay securely with M-PESA. Your payment information is never stored.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-coffee-light/30 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-coffee-dark">Premium Quality</h3>
                <p className="text-muted-foreground">We source the finest coffee beans from around the world for exceptional taste.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <PaymentModal 
        product={selectedProduct}
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
      />
    </div>
  );
};

export default Index;
