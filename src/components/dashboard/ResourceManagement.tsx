"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const resourceOptions = ["Water Usage", "Fertilizer", "Pesticide"];

export const ResourceManagement = () => {
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [resources, setResources] = useState([]);
  const [farmSize, setFarmSize] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleResource = (resource) => {
    setResources((prev) =>
      prev.includes(resource)
        ? prev.filter((r) => r !== resource)
        : [...prev, resource]
    );
  };

  const handleSubmit = async () => {
    if (!crop || !location || !startDate || resources.length === 0 || !farmSize) {
      alert("Please fill in all fields, including farm size.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://farm-wise-93ni.onrender.com/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, location, startDate, resources, farmSize }),
      });
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error("Error fetching resource plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderPlan = () => {
    if (!plan) return null;

    try {
      // Try to parse if it's a JSON string
      const parsedPlan = typeof plan === 'string' ? JSON.parse(plan) : plan;
      const planArray = Array.isArray(parsedPlan) ? parsedPlan : [parsedPlan];

      return (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary">
            Resource Plan for {crop} in {location} ({farmSize} acres)
          </h3>
          {planArray.map((item, index) => (
            <Card key={index} className="border-l-4 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {item.resource === 'Water Usage' && '💧 Water Usage'}
                  {item.resource === 'Fertilizer' && '🌱 Fertilizer'}
                  {item.resource === 'Pesticide' && '🧪 Pesticide'}
                  {!['Water Usage', 'Fertilizer', 'Pesticide'].includes(item.resource) && 
                    (item.resource || 'Resource Plan')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.amount && (
                  <div className="bg-secondary/10 p-3 rounded">
                    <h4 className="font-medium text-primary">Amount Needed:</h4>
                    {typeof item.amount === 'object' && item.amount !== null && !Array.isArray(item.amount) ? (
                      <ul className="list-disc pl-5">
                        {Object.entries(item.amount).map(([key, value]) => (
                          <li key={key} className="text-foreground">
                            <span className="font-semibold">{key}:</span> {String(value)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{String(item.amount).replace(/"/g, '')}</p>
                    )}
                  </div>
                )}
                {item.advice && (
                  <div className="bg-secondary/5 p-3 rounded">
                    <h4 className="font-medium text-primary">Recommendations:</h4>
                    <div className="mt-1 space-y-2">
                      {item.advice.split('\n').map((line, i) => (
                        <p key={i} className="text-foreground">
                          {line.replace(/"/g, '').replace(/\*/g, '•')}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <div className="text-sm text-muted-foreground italic mt-4">
            Note: The provided plan is a general guideline and may need adjustment based on local conditions. 
            Always consult with local agricultural experts for advice tailored to your farm's specific needs.
          </div>
        </div>
      );
    } catch (error) {
      // Fallback display if parsing fails
      return (
        <Card className="mt-6 border-l-4 border-primary">
          <CardHeader>
            <CardTitle>Resource Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line">
              {typeof plan === 'string' ? plan : JSON.stringify(plan, null, 2)}
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-secondary">Resource Management Planner</CardTitle>
        <CardDescription className="text-secondary-foreground">
          Enter details to get a full resource plan from cultivation to harvest
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Input 
            placeholder="Crop (e.g. Wheat)" 
            value={crop} 
            onChange={(e) => setCrop(e.target.value)}
            className="bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          <Input 
            placeholder="Location (e.g. Punjab)" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          <Input
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Farm Size (acres)"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            className="bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          {resourceOptions.map((res) => (
            <label key={res} className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all duration-200">
              <Checkbox 
                checked={resources.includes(res)} 
                onCheckedChange={() => toggleResource(res)}
                className="text-primary border-primary focus:ring-primary/20"
              />
              <span className="text-foreground">{res}</span>
            </label>
          ))}
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-200 hover:scale-105"
        >
          {loading ? "Generating..." : "Generate Resource Plan"}
        </Button>

        {renderPlan()}
      </CardContent>
    </Card>
  );
};