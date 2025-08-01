import React from "react";
import { Coffee } from "lucide-react";
import { getToken } from "@/lib/api";

interface HeaderProps {
  openAuthModal: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAuthModal, isLoggedIn, onLogout }) => {
  const isAdmin = React.useMemo(() => {
    const token = getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    } catch {
      return false;
    }
  }, [isLoggedIn]);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-coffee-light/30 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-coffee" />
          <h1 className="text-2xl font-bold text-coffee">Coffee Kiosk</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-coffee hover:text-coffee-dark transition-colors font-medium">
            Home
          </a>
          {/* <a href="#" className="text-coffee hover:text-coffee-dark transition-colors font-medium">
            Menu
          </a>
          <a href="#" className="text-coffee hover:text-coffee-dark transition-colors font-medium">
            About
          </a>
          <a href="#" className="text-coffee hover:text-coffee-dark transition-colors font-medium">
            Contact
          </a> */}
          {isLoggedIn && !isAdmin && (
            <a href="/my-orders" className="text-coffee hover:text-mpesa transition-colors font-medium">
              My Orders
            </a>
          )}
          {isAdmin && (
            <a href="/admin" className="text-red-600 hover:text-red-700 transition-colors font-medium">
              Admin
            </a>
          )}
          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <button
              className="text-coffee hover:text-red-600 transition-colors font-medium"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="text-coffee hover:text-coffee-dark transition-colors font-medium"
              onClick={openAuthModal}
            >
              Login
            </button>
          )}
        </nav>
        <div className="md:hidden">
          <button className="p-2 rounded-md hover:bg-coffee-light/20 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-coffee"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
