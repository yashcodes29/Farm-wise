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
  const [plan, setPlan] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleResource = (resource) => {
    setResources((prev) =>
      prev.includes(resource)
        ? prev.filter((r) => r !== resource)
        : [...prev, resource]
    );
  };

  const handleSubmit = async () => {
    if (!crop || !location || !startDate || resources.length === 0) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, location, startDate, resources }),
      });
      const data = await res.json();
      setPlan(data.plan || []);
      setSummary(data.summary || []);
    } catch (err) {
      console.error("Error fetching resource plan:", err);
    } finally {
      setLoading(false);
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

        {plan.length > 0 && (
          <div className="mt-4 space-y-6 max-h-[400px] overflow-y-scroll">
            {plan.map((entry, i) => (
              <div key={i} className="p-4 border rounded-lg bg-background border-border transition-all duration-200 hover:shadow-md">
                <h3 className="text-lg font-semibold text-primary">{entry.date} - {entry.stage}</h3>
                <p className="text-sm mb-1 text-secondary-foreground">🌡 Temp: {entry.temperature}°C | 🌧 Rain: {entry.rainfall}mm</p>
                <ul className="list-disc pl-6 space-y-1">
                  {entry.recommendations.map((rec, j) => (
                    <li key={j} className="text-foreground">
                      <strong className="text-primary">{rec.resource}</strong> ({rec.amount}): {rec.advice} [{rec.activity}]
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {summary.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-semibold text-primary">📦 Resource Buying Summary</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {summary.map((item, i) => (
                <li key={i} className="text-foreground">
                  <strong className="text-secondary">{item.resource}:</strong> {item.totalAmount} — {item.notes}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
