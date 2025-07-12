
import React from "react";
import { TopNavBar } from "./TopNavBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-100 to-indigo-200 animate-gradient-x">
      <TopNavBar />
      <main className="max-w-5xl w-full mx-auto px-2 sm:px-6 py-8 mt-6 rounded-2xl shadow-2xl bg-white/80 dark:bg-background/80 backdrop-blur-md border border-border animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
