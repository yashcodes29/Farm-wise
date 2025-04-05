
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const priceData = [
  {
    name: "Corn",
    current: "$4.32/bushel",
    change: "+0.15",
    trend: "up",
    forecast: "Rising slowly",
    data: [
      { month: "Jan", price: 4.05 },
      { month: "Feb", price: 4.12 },
      { month: "Mar", price: 4.08 },
      { month: "Apr", price: 4.17 },
      { month: "May", price: 4.32 },
    ]
  },
  {
    name: "Soybeans",
    current: "$10.45/bushel",
    change: "-0.22",
    trend: "down",
    forecast: "Declining short-term",
    data: [
      { month: "Jan", price: 10.75 },
      { month: "Feb", price: 10.82 },
      { month: "Mar", price: 10.67 },
      { month: "Apr", price: 10.58 },
      { month: "May", price: 10.45 },
    ]
  },
  {
    name: "Wheat",
    current: "$6.87/bushel",
    change: "+0.03",
    trend: "up",
    forecast: "Stable with slight increase",
    data: [
      { month: "Jan", price: 6.75 },
      { month: "Feb", price: 6.72 },
      { month: "Mar", price: 6.80 },
      { month: "Apr", price: 6.84 },
      { month: "May", price: 6.87 },
    ]
  }
];

export const MarketPrices = () => {
  return (
    <Card>
      <CardHeader className="bg-accent/10">
        <CardTitle className="text-accent-foreground">Market Prices</CardTitle>
        <CardDescription>Current market trends for your crops</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {priceData.map((crop) => (
            <div key={crop.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{crop.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{crop.current}</span>
                  <span className={`flex items-center text-xs font-medium ${crop.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {crop.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {crop.change}
                  </span>
                </div>
              </div>
              
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crop.data}>
                    <XAxis dataKey="month" tick={{fontSize: 10}} />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={crop.trend === 'up' ? "#4D7C0F" : "#EF4444"} 
                      strokeWidth={2} 
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <span>Forecast: {crop.forecast}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
