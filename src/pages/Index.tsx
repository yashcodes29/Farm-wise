
import { FarmProfileCard } from "@/components/dashboard/FarmProfileCard";
import { WeatherForecast } from "@/components/dashboard/WeatherForecast";
import { CropHealthMonitor } from "@/components/dashboard/CropHealthMonitor";
import { ResourceManagement } from "@/components/dashboard/ResourceManagement";
import { MarketPrices } from "@/components/dashboard/MarketPrices";
import { CommunityForum } from "@/components/dashboard/CommunityForum";

const Index = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow">FarmWise Dashboard</h1>
        <p className="text-lg text-secondary-foreground mt-1">Your smart farming assistant</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
