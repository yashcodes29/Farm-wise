
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CloudDrizzle, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const dailyForecast = [
  {
    day: "Monday",
    date: "Apr 5",
    condition: "Sunny",
    high: 75,
    low: 58,
    precipitation: 0,
    humidity: 45,
    wind: 8,
    icon: Sun
  },
  {
    day: "Tuesday",
    date: "Apr 6",
    condition: "Partly Cloudy",
    high: 72,
    low: 56,
    precipitation: 10,
    humidity: 50,
    wind: 10,
    icon: Cloud
  },
  {
    day: "Wednesday",
    date: "Apr 7",
    condition: "Rain",
    high: 68,
    low: 54,
    precipitation: 80,
    humidity: 75,
    wind: 12,
    icon: CloudRain
  },
  {
    day: "Thursday",
    date: "Apr 8",
    condition: "Partly Cloudy",
    high: 71,
    low: 57,
    precipitation: 20,
    humidity: 55,
    wind: 7,
    icon: Cloud
  },
  {
    day: "Friday",
    date: "Apr 9",
    condition: "Sunny",
    high: 78,
    low: 60,
    precipitation: 0,
    humidity: 40,
    wind: 5,
    icon: Sun
  },
  {
    day: "Saturday",
    date: "Apr 10",
    condition: "Sunny",
    high: 80,
    low: 62,
    precipitation: 0,
    humidity: 35,
    wind: 4,
    icon: Sun
  },
  {
    day: "Sunday",
    date: "Apr 11",
    condition: "Partly Cloudy",
    high: 76,
    low: 59,
    precipitation: 10,
    humidity: 45,
    wind: 6,
    icon: Cloud
  }
];

const hourlyData = Array.from({ length: 24 }, (_, i) => {
  // Create some realistic temperature fluctuations
  const hour = i;
  const temp = 65 + Math.sin((hour - 6) * 0.5) * 15; // Peak at mid-day
  
  // Condition changes based on time of day
  let condition = "Sunny";
  let icon = Sun;
  
  if (hour < 6 || hour > 20) {
    condition = "Clear";
    icon = Sun;
  } else if (hour > 12 && hour < 16) {
    condition = "Partly Cloudy";
    icon = Cloud;
  }
  
  return {
    time: `${hour}:00`,
    temperature: Math.round(temp),
    condition,
    precipitation: hour > 12 && hour < 15 ? 10 : 0,
    icon
  };
});

const temperatureData = dailyForecast.map(day => ({
  name: day.day,
  high: day.high,
  low: day.low
}));

const precipitationData = dailyForecast.map(day => ({
  name: day.day,
  precipitation: day.precipitation
}));

const Weather = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-farm-sky-dark">Weather Forecast</h1>
        <p className="text-muted-foreground mt-1">7-day forecast and weather impacts on your farm</p>
      </div>

      <Tabs defaultValue="forecast" className="mb-8">
        <TabsList>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="impact">Farm Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="space-y-6">
          {/* Daily cards */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {dailyForecast.map((day) => (
              <Card key={day.day} className={day.day === "Monday" ? "bg-farm-sky-light/10" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                  <CardDescription>{day.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-1">
                    <day.icon className="h-8 w-8 text-farm-sky-dark" />
                    <p className="text-sm">{day.condition}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{day.high}°</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="text-sm">{day.low}°</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Droplets className="h-3 w-3 text-farm-sky-dark" />
                      <span className="text-xs">{day.precipitation}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temperature Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="high" 
                        stroke="#F97316" 
                        strokeWidth={2}
                        name="High"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="low" 
                        stroke="#0EA5E9" 
                        strokeWidth={2}
                        name="Low"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Precipitation Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={precipitationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="precipitation" 
                        fill="#0EA5E9" 
                        name="Chance of Rain %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
              <CardDescription>Detailed 24-hour forecast for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {hourlyData.map((hour, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col items-center p-4 rounded-lg min-w-[80px] ${
                        idx === 12 ? "bg-farm-sky-light/10" : ""
                      }`}
                    >
                      <span className="text-xs font-medium">{hour.time}</span>
                      <hour.icon className="h-6 w-6 my-2 text-farm-sky-dark" />
                      <span className="text-sm font-bold">{hour.temperature}°</span>
                      <div className="flex items-center mt-1">
                        <Droplets className="h-3 w-3 text-farm-sky-dark mr-1" />
                        <span className="text-xs">{hour.precipitation}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Weather Impact Analysis</CardTitle>
              <CardDescription>How current and upcoming weather affects your farm operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-farm-sky-light/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-farm-sky-dark" />
                      <h3 className="font-medium">Irrigation Needs</h3>
                    </div>
                    <p className="text-sm">Rainfall expected Wednesday (0.5-0.7 inches). Consider skipping irrigation on Tuesday and adjusting schedule for late week.</p>
                  </div>

                  <div className="p-4 bg-farm-leaf-light/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5 text-farm-leaf-dark" />
                      <h3 className="font-medium">Crop Development</h3>
                    </div>
                    <p className="text-sm">Temperature trends favorable for corn growth stage. Accumulated growing degree days: 145 (12% above average).</p>
                  </div>

                  <div className="p-4 bg-farm-soil-light/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-5 w-5 text-farm-soil-dark" />
                      <h3 className="font-medium">Field Operations</h3>
                    </div>
                    <p className="text-sm">Optimal spraying conditions on Friday and Saturday. Low wind, no precipitation, temperatures below 85°F.</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">7-Day Weather Impact Summary</h3>
                  <ul className="space-y-2">
                    <li className="text-sm flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 font-medium px-1.5 py-0.5 rounded text-xs">Favorable</span>
                      <span>Weekend weather optimal for planting and field operations</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 font-medium px-1.5 py-0.5 rounded text-xs">Watch</span>
                      <span>Wednesday rain may delay mid-week operations</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 font-medium px-1.5 py-0.5 rounded text-xs">Favorable</span>
                      <span>Temperature trends positive for current growth stages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Weather;
