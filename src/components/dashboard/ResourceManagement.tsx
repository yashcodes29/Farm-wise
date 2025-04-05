
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Trash } from "lucide-react";

const resourceData = [
  {
    name: "Water Usage",
    icon: Droplets,
    current: "Optimal",
    recommendation: "Reduce irrigation by 15% this week based on rainfall forecast",
    saving: "Potential saving: 4,500 gallons",
    color: "text-farm-sky-dark"
  },
  {
    name: "Fertilizer",
    icon: Trash,
    current: "Above Optimal",
    recommendation: "Consider soil testing before next application. Current levels above recommended.",
    saving: "Potential saving: $120/acre",
    color: "text-farm-soil-dark"
  }
];

export const ResourceManagement = () => {
  return (
    <Card>
      <CardHeader className="bg-farm-soil-light/10">
        <CardTitle className="text-farm-soil-dark">Resource Management</CardTitle>
        <CardDescription>Optimize your farm's resources</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {resourceData.map((resource) => (
            <div key={resource.name} className="space-y-3">
              <div className="flex items-center gap-2">
                <resource.icon className={`h-5 w-5 ${resource.color}`} />
                <span className="font-medium">{resource.name}</span>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium">Current Status: {resource.current}</p>
                <p className="text-sm mt-1">
                  {resource.recommendation}
                </p>
                <p className="text-xs text-primary font-medium mt-2">
                  {resource.saving}
                </p>
              </div>
            </div>
          ))}
          
          <Button className="w-full">View Detailed Resource Plan</Button>
        </div>
      </CardContent>
    </Card>
  );
};
