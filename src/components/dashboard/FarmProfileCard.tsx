
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Edit } from "lucide-react";

export const FarmProfileCard = () => {
  const { user } = useUser();
  const [location, setLocation] = useState<string>("Fetching location...");
  const [crops, setCrops] = useState<string[]>(["Corn", "Soybeans", "Wheat"]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          // Use a free reverse geocoding API for demo (OpenStreetMap Nominatim)
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            setLocation(data.address?.city || data.address?.town || data.address?.village || data.display_name || `Lat: ${latitude}, Lon: ${longitude}`);
          } catch {
            setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
          }
        },
        () => setLocation("Location unavailable")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const handleAddCrop = () => {
    const crop = prompt("Enter new crop name:");
    if (crop && crop.trim().length > 0 && !crops.includes(crop.trim())) {
      setCrops([...crops, crop.trim()]);
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="bg-primary/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-primary">Farm Profile</CardTitle>
          <Button variant="ghost" size="icon" className="hover:bg-primary/20">
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
        <CardDescription className="text-secondary-foreground">Your farm location and current crops</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="avatar" className="h-8 w-8 rounded-full border border-primary shadow" />
            ) : (
              <User className="text-secondary h-8 w-8" />
            )}
            <div>
              <p className="text-base font-semibold text-foreground">{user?.fullName || user?.username || "Guest User"}</p>
              <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || "No email"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-secondary h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-foreground">Location</p>
              <p className="text-xs text-muted-foreground">{location}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-foreground">Current Crops</p>
            <div className="flex flex-wrap gap-2 items-center">
              {crops.map((crop) => (
                <span 
                  key={crop} 
                  className="px-2 py-1 bg-accent/20 text-accent-foreground rounded-md text-xs animate-bounce-in"
                >
                  {crop}
                </span>
              ))}
              <Button variant="outline" size="sm" className="h-7 text-xs ml-2 px-3 py-1 border-primary text-primary hover:bg-primary/10 transition-all duration-200" onClick={handleAddCrop}>
                + Add Crop
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-foreground">Farm Size</p>
            <p className="text-sm text-foreground">25 acres</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
