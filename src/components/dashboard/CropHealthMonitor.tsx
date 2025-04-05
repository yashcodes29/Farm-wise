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

      // Extract health score
      const scoreMatch = resultText.match(/(?:score|overall score)[^\d]{0,10}(\d{1,3})/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

      // Clean analysis: remove * characters
      const cleanedText = resultText
        .replace(/[*_]+/g, "") // remove **bold** and *italic*
        .replace(/score[^\d]{0,10}\d{1,3}\/?100?/i, "") // remove score line
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
    <Card>
      <CardHeader className="bg-farm-leaf-dark/10">
        <CardTitle className="text-farm-leaf-dark">Crop Health Monitor</CardTitle>
        <CardDescription>Enter crop details for health analysis</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <select name="cropName" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Crop</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
        </select>

        <input
          name="color"
          placeholder="Color of Crop (Green, Yellow, Brown)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="leafSpots"
          placeholder="Leaf Spots (None, Few, Many)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="growthSpeed"
          placeholder="Growth Speed (Fast, Normal, Slow)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="soilCondition"
          placeholder="Soil Condition (Dry, Moist, Wet)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={analyzeCrop}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Analyze
        </button>

        {loading && <p className="text-sm text-muted-foreground">Analyzing crop health...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {(aiAnalysis || healthScore !== null) && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-4 text-sm mt-4">
            {healthScore !== null && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-700">Health Score:</span>
                  <span className="text-green-700 font-semibold">{healthScore}/100</span>
                </div>
                <Progress value={healthScore} className="h-2" />
              </>
            )}

            {aiAnalysis && (
              <div>
                <p className="font-medium text-gray-700">AI Analysis:</p>
                <p className="text-gray-600 whitespace-pre-wrap">{aiAnalysis}</p>
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
