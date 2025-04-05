
import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-2 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <SidebarTrigger />
              </div>
              <div className="flex items-center space-x-2">
                <div className="hidden md:block font-medium">Welcome, Farmer</div>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
