
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

const cropHealthData = [
  {
    crop: "Corn",
    health: 85,
    status: "Good",
    alert: false,
    lastUpdated: "Today, 8:24 AM"
  },
  {
    crop: "Soybeans",
    health: 65,
    status: "Fair",
    alert: true,
    alertMessage: "Potential signs of rust detected",
    lastUpdated: "Today, 8:24 AM"
  },
  {
    crop: "Wheat",
    health: 92,
    status: "Excellent",
    alert: false,
    lastUpdated: "Today, 8:24 AM"
  }
];

export const CropHealthMonitor = () => {
  return (
    <Card>
      <CardHeader className="bg-farm-leaf-dark/10">
        <CardTitle className="text-farm-leaf-dark">Crop Health Monitor</CardTitle>
        <CardDescription>Current status of your crops</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {cropHealthData.map((crop) => (
            <div key={crop.crop} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{crop.crop}</span>
                  {crop.alert && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <span 
                  className={`text-xs font-medium ${
                    crop.status === "Excellent" 
                      ? "text-green-600" 
                      : crop.status === "Good" 
                      ? "text-green-500" 
                      : "text-amber-500"
                  }`}
                >
                  {crop.status}
                </span>
              </div>
              
              <Progress 
                value={crop.health} 
                className={`h-2 ${
                  crop.health > 80 
                    ? "bg-green-100" 
                    : crop.health > 60 
                    ? "bg-amber-100" 
                    : "bg-red-100"
                }`}
              />
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Health Score: {crop.health}%</span>
                <span>Updated: {crop.lastUpdated}</span>
              </div>
              
              {crop.alert && (
                <div className="bg-amber-50 border border-amber-200 p-2 rounded-md mt-2">
                  <p className="text-xs text-amber-700">{crop.alertMessage}</p>
                </div>
              )}
            </div>
          ))}
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium">AI Analysis</p>
            <p className="text-xs text-muted-foreground mt-1">
              Satellite imagery indicates potential early signs of soybean rust. Recommend field inspection of southeast quadrant within 48 hours.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
