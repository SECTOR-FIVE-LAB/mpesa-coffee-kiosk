import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyOrdersPage from "./pages/my-orders";
import AdminPage from "./pages/admin";
import { getToken } from "@/lib/api";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const isLoggedIn = !!getToken();
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const token = getToken();
  if (!token) return <Navigate to="/" replace />;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.isAdmin ? children : <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/" replace />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/my-orders" element={
            <RequireAuth>
              <MyOrdersPage />
            </RequireAuth>
          } />
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
