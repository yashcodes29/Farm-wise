
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Edit } from "lucide-react";

export const FarmProfileCard = () => {
  return (
    <Card>
      <CardHeader className="bg-farm-leaf-light/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-farm-leaf-dark">Farm Profile</CardTitle>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Your farm location and current crops</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-farm-soil-dark h-5 w-5" />
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-muted-foreground">Small-Scale Farmer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="text-farm-soil-dark h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground">Midwest Region, Zone 5b</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Current Crops</p>
            <div className="flex flex-wrap gap-2">
              {['Corn', 'Soybeans', 'Wheat'].map((crop) => (
                <span 
                  key={crop} 
                  className="px-2 py-1 bg-farm-leaf-light/20 text-farm-leaf-dark rounded-md text-xs"
                >
                  {crop}
                </span>
              ))}
              <Button variant="outline" size="sm" className="h-7 text-xs">
                + Add Crop
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Farm Size</p>
            <p className="text-sm">25 acres</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
