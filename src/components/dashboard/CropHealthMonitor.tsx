import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const CropHealthMonitor = () => {
  const [formData, setFormData] = useState({
    cropName: "",
    color: "",
    leafSpots: "",
    growthSpeed: "",
    soilCondition: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setAiAnalysis(null);
    setHealthScore(null);
  };

  const analyzeCrop = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/analyze", formData);
      const resultText = res.data;

      const scoreMatch = resultText.match(/(?:score|overall score)[^\d]{0,10}(\d{1,3})/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

      const cleanedText = resultText
        .replace(/[*_]+/g, "")
        .replace(/score[^\d]{0,10}\d{1,3}\/?100?/i, "")
        .trim();

      setHealthScore(score);
      setAiAnalysis(cleanedText);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError("Failed to analyze crop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-primary">Crop Health Monitor</CardTitle>
        <CardDescription className="text-secondary-foreground">Enter crop details for health analysis</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <select name="cropName" onChange={handleChange} className="w-full p-3 border rounded-md bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <option value="">Select Crop</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
          <option value="Sugarcane">Sugarcane</option>
          <option value="Cotton">Cotton</option>
          <option value="Barley">Barley</option>
          <option value="Soybean">Soybean</option>
          <option value="Groundnut">Groundnut</option>
          <option value="Bajra">Bajra</option>
        </select>

        <select name="color" onChange={handleChange} className="w-full p-3 border rounded-md bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <option value="">Color of Crop</option>
          <option value="Dark Green">Dark Green</option>
          <option value="Light Green">Light Green</option>
          <option value="Yellow">Yellow</option>
          <option value="Brown">Brown</option>
          <option value="Pale Green">Pale Green</option>
          <option value="Spotted">Spotted</option>
        </select>

        <select name="leafSpots" onChange={handleChange} className="w-full p-3 border rounded-md bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <option value="">Leaf Spots</option>
          <option value="None">None</option>
          <option value="Few">Few</option>
          <option value="Many">Many</option>
          <option value="Circular">Circular</option>
          <option value="Irregular">Irregular</option>
          <option value="Large Dark">Large Dark</option>
        </select>

        <select name="growthSpeed" onChange={handleChange} className="w-full p-3 border rounded-md bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <option value="">Growth Speed</option>
          <option value="Very Fast">Very Fast</option>
          <option value="Fast">Fast</option>
          <option value="Normal">Normal</option>
          <option value="Slow">Slow</option>
          <option value="Stunted">Stunted</option>
        </select>

        <select name="soilCondition" onChange={handleChange} className="w-full p-3 border rounded-md bg-background text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <option value="">Soil Condition</option>
          <option value="Dry">Dry</option>
          <option value="Moist">Moist</option>
          <option value="Wet">Wet</option>
          <option value="Cracked">Cracked</option>
          <option value="Sandy">Sandy</option>
          <option value="Clay">Clay</option>
          <option value="Saline">Saline</option>
        </select>

        <Button
          onClick={analyzeCrop}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105"
        >
          {loading ? "Analyzing..." : "Analyze Crop Health"}
        </Button>

        {loading && <p className="text-sm text-muted-foreground animate-pulse">Analyzing crop health...</p>}
        {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}

        {(aiAnalysis || healthScore !== null) && (
          <div className="bg-background border border-border p-4 rounded-md space-y-4 text-sm mt-4 animate-fade-in">
            {healthScore !== null && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary">Health Score:</span>
                  <span className="text-primary font-semibold">{healthScore}/100</span>
                </div>
                <Progress value={healthScore} className="h-2" />
              </>
            )}

            {aiAnalysis && (
              <div>
                <p className="font-medium text-primary mb-2">AI Analysis:</p>
                <p className="text-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{aiAnalysis}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground flex justify-between pt-2 border-t mt-2">
              <span>Crop: {formData.cropName || "N/A"}</span>
              <span>Time: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
