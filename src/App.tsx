import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Weather from "./pages/Weather";
import MainLayout from "@/components/layout/MainLayout";
import { ClerkProvider } from "@clerk/clerk-react";
import { CropHealthMonitor } from "@/components/dashboard/CropHealthMonitor";
import { MarketPrices } from "@/components/dashboard/MarketPrices";
import { CommunityForum } from "@/components/dashboard/CommunityForum";
import { ResourceManagement } from "@/components/dashboard/ResourceManagement";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/crop-health" element={<CropHealthMonitor />} />
                <Route path="/resources" element={<ResourceManagement />} />
                <Route path="/market" element={<MarketPrices />} />
                <Route path="/community" element={<CommunityForum />} />
                <Route path="/analytics" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
