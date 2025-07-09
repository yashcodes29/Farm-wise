
import { FarmProfileCard } from "@/components/dashboard/FarmProfileCard";
import { WeatherForecast } from "@/components/dashboard/WeatherForecast";
import { CropHealthMonitor } from "@/components/dashboard/CropHealthMonitor";
import { ResourceManagement } from "@/components/dashboard/ResourceManagement";
import { MarketPrices } from "@/components/dashboard/MarketPrices";
import { CommunityForum } from "@/components/dashboard/CommunityForum";
import { SignInButton, useUser, SignUpButton } from "@clerk/clerk-react";

const Index = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-96 text-lg text-primary animate-pulse">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="flex flex-col items-center gap-2 mb-4 animate-bounce-in">
          <span className="text-6xl md:text-7xl drop-shadow">🌱🚜</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow">Welcome to FarmWise</h1>
        </div>
        <p className="text-lg md:text-xl text-secondary-foreground mb-4 max-w-xl text-center animate-fade-in">
          <span className="font-semibold text-accent">FarmWise</span> is your all-in-one smart farming assistant. Track weather, monitor crop health, manage resources, connect with the community, and boost your yields—all in one beautiful dashboard! 🌾🌤️
        </p>
        <div className="flex gap-4 mt-4 animate-bounce-in">
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-md shadow-sm hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-base">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-secondary text-secondary-foreground font-semibold px-5 py-2 rounded-md border border-primary/20 shadow-sm hover:bg-secondary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-base">
              Sign Up
            </button>
          </SignUpButton>
        </div>
        <p className="mt-8 text-muted-foreground text-sm animate-fade-in">Sign in or create an account to unlock your personalized dashboard and all features.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow">FarmWise Dashboard</h1>
        <p className="text-lg text-secondary-foreground mt-1">Your smart farming assistant</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
        {/* Top row */}
        <div className="md:col-span-4">
          <FarmProfileCard />
        </div>
        <div className="md:col-span-8">
          <WeatherForecast />
        </div>
        {/* Middle row */}
        <div className="md:col-span-6">
          <CropHealthMonitor />
        </div>
        <div className="md:col-span-6">
          <ResourceManagement />
        </div>
        {/* Bottom row */}
        <div className="md:col-span-7">
          <MarketPrices />
        </div>
        <div className="md:col-span-5">
          <CommunityForum />
        </div>
      </div>
    </>
  );
};

export default Index;
