import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Direct price data in ₹/kg
const priceData = [
  {
    name: "Basmati Rice (Pusa 1121)",
    current: "₹95/kg",
    change: "+3.50",
    trend: "up",
    forecast: "Export demand pushing prices up",
    data: [
      { month: "Jan", price: 85 },
      { month: "Feb", price: 87 },
      { month: "Mar", price: 90 },
      { month: "Apr", price: 92 },
      { month: "May", price: 95 },
    ],
  },
  {
    name: "Wheat (MP Sharbati)",
    current: "₹27/kg",
    change: "-1.20",
    trend: "down",
    forecast: "New harvest arrivals",
    data: [
      { month: "Jan", price: 28.5 },
      { month: "Feb", price: 28 },
      { month: "Mar", price: 27.8 },
      { month: "Apr", price: 27.5 },
      { month: "May", price: 27 },
    ],
  },
  {
    name: "Tomato (Hybrid)",
    current: "₹45/kg",
    change: "+15.00",
    trend: "up",
    forecast: "Supply shortage due to heatwave",
    data: [
      { month: "Jan", price: 30 },
      { month: "Feb", price: 25 },
      { month: "Mar", price: 28 },
      { month: "Apr", price: 35 },
      { month: "May", price: 45 },
    ],
  },
  {
    name: "Onion (Nashik Red)",
    current: "₹28/kg",
    change: "-2.00",
    trend: "down",
    forecast: "Improved supply from Maharashtra",
    data: [
      { month: "Jan", price: 35 },
      { month: "Feb", price: 32 },
      { month: "Mar", price: 30 },
      { month: "Apr", price: 29 },
      { month: "May", price: 28 },
    ],
  },
  {
    name: "Potato (Cold Storage)",
    current: "₹15/kg",
    change: "+0.50",
    trend: "up",
    forecast: "Reduced stock availability",
    data: [
      { month: "Jan", price: 14 },
      { month: "Feb", price: 14.2 },
      { month: "Mar", price: 14.5 },
      { month: "Apr", price: 14.8 },
      { month: "May", price: 15 },
    ],
  },
  {
    name: "Sugar (M Grade)",
    current: "₹42/kg",
    change: "+0.80",
    trend: "up",
    forecast: "Mills holding back stock",
    data: [
      { month: "Jan", price: 40 },
      { month: "Feb", price: 40.5 },
      { month: "Mar", price: 41 },
      { month: "Apr", price: 41.5 },
      { month: "May", price: 42 },
    ],
  },
  {
    name: "Turmeric (Nizamabad)",
    current: "₹14,500/quintal",
    change: "+500.00",
    trend: "up",
    forecast: "Strong export orders",
    data: [
      { month: "Jan", price: 13500 },
      { month: "Feb", price: 14000 },
      { month: "Mar", price: 14200 },
      { month: "Apr", price: 14300 },
      { month: "May", price: 14500 },
    ],
  },
  {
    name: "Cotton (Gujarat)",
    current: "₹6,200/quintal",
    change: "-150.00",
    trend: "down",
    forecast: "Slow demand from mills",
    data: [
      { month: "Jan", price: 6350 },
      { month: "Feb", price: 6300 },
      { month: "Mar", price: 6250 },
      { month: "Apr", price: 6200 },
      { month: "May", price: 6200 },
    ],
  },
  {
    name: "Soybean (Indore)",
    current: "₹4,800/quintal",
    change: "+200.00",
    trend: "up",
    forecast: "Crush demand increasing",
    data: [
      { month: "Jan", price: 4500 },
      { month: "Feb", price: 4600 },
      { month: "Mar", price: 4700 },
      { month: "Apr", price: 4750 },
      { month: "May", price: 4800 },
    ],
  },
  {
    name: "Mango (Alphonso)",
    current: "₹800/dozen",
    change: "+100.00",
    trend: "up",
    forecast: "Peak season premium pricing",
    data: [
      { month: "Jan", price: 700 },
      { month: "Feb", price: 750 },
      { month: "Mar", price: 780 },
      { month: "Apr", price: 790 },
      { month: "May", price: 800 },
    ],
  }
];


export const MarketPrices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrops = priceData.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="bg-accent/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-accent-foreground">Market Prices</CardTitle>
            <CardDescription>Current commodity prices in ₹/kg</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search crops..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {filteredCrops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No crops found matching your search
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCrops.map((crop) => (
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
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tick={{fontSize: 10}} 
                        tickFormatter={(value) => `₹${value.toFixed(2)}`}
                      />
                        <Tooltip 
                        formatter={(value: number) => [`₹${value.toFixed(2)}`, "Price"]}
                        labelFormatter={(label: string) => `Month: ${label}`}
                        />
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
        )}
      </CardContent>
    </Card>
  );
};