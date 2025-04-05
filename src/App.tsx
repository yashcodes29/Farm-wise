import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Weather from "./pages/Weather";
import { useAuth0 } from "@auth0/auth0-react";

const queryClient = new QueryClient();

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="p-4 flex justify-between items-center bg-gray-100 border-b">
            <h1 className="text-xl font-bold">🌾 Smart Farming App</h1>
            <div className="flex items-center gap-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : !isAuthenticated ? (
                <button
                  onClick={() => loginWithRedirect()}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Log In
                </button>
              ) : (
                <>
                  <p>Hello, {user?.name}</p>
                  <button
                    onClick={() =>
                      logout({ logoutParams: { returnTo: window.location.origin } })
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/crop-health" element={<Index />} />
            <Route path="/resources" element={<Index />} />
            <Route path="/market" element={<Index />} />
            <Route path="/community" element={<Index />} />
            <Route path="/analytics" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
