import { useEffect, useState } from "react";
import { getLatestPrices } from "@/api/useGeminiPrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const MarketPrices = () => {
  const [prices, setPrices] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestPrices(["wheat", "rice", "onion", "tomato", "potato"]).then((data) => {
      setPrices(data || "Unable to fetch prices.");
      setLoading(false);
    });
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>🛒 Market Price Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <Loader2 className="animate-spin mr-2" /> Fetching real-time prices...
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{prices}</pre>
        )}
      </CardContent>
    </Card>
  );
};
