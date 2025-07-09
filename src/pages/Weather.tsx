
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
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow">Weather Forecast</h1>
        <p className="text-lg text-secondary-foreground mt-1">7-day forecast and weather impacts on your farm</p>
      </div>

      <Tabs defaultValue="forecast" className="mb-8">
        <TabsList className="bg-background border border-border">
          <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Forecast</TabsTrigger>
          <TabsTrigger value="hourly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Hourly</TabsTrigger>
          <TabsTrigger value="impact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Farm Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="space-y-6 animate-fade-in">
          {/* Daily cards */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {dailyForecast.map((day, index) => (
              <Card key={day.day} className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${day.day === "Monday" ? "bg-primary/10 border-primary/20" : ""}`} style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">{day.day}</CardTitle>
                  <CardDescription className="text-secondary-foreground">{day.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-1">
                    <day.icon className="h-8 w-8 text-secondary transition-colors duration-200" />
                    <p className="text-sm text-foreground">{day.condition}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-primary">{day.high}°</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="text-sm">{day.low}°</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Droplets className="h-3 w-3 text-accent" />
                      <span className="text-xs text-accent-foreground">{day.precipitation}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Temperature Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="high" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="High"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="low" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        name="Low"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Precipitation Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={precipitationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Bar 
                        dataKey="precipitation" 
                        fill="hsl(var(--accent))" 
                        name="Chance of Rain %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="animate-fade-in">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Hourly Forecast</CardTitle>
              <CardDescription className="text-secondary-foreground">Detailed 24-hour forecast for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {hourlyData.map((hour, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col items-center p-4 rounded-lg min-w-[80px] transition-all duration-200 hover:scale-105 ${
                        idx === 12 ? "bg-primary/10 border border-primary/20" : "bg-background border border-border"
                      }`}
                    >
                      <span className="text-xs font-medium text-foreground">{hour.time}</span>
                      <hour.icon className="h-6 w-6 my-2 text-secondary" />
                      <span className="text-sm font-bold text-primary">{hour.temperature}°</span>
                      <div className="flex items-center mt-1">
                        <Droplets className="h-3 w-3 text-accent mr-1" />
                        <span className="text-xs text-accent-foreground">{hour.precipitation}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="animate-fade-in">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Weather Impact Analysis</CardTitle>
              <CardDescription className="text-secondary-foreground">How current and upcoming weather affects your farm operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 transition-all duration-200 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-primary">Irrigation Needs</h3>
                    </div>
                    <p className="text-sm text-foreground">Rainfall expected Wednesday (0.5-0.7 inches). Consider skipping irrigation on Tuesday and adjusting schedule for late week.</p>
                  </div>

                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 transition-all duration-200 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5 text-secondary" />
                      <h3 className="font-medium text-secondary">Crop Development</h3>
                    </div>
                    <p className="text-sm text-foreground">Temperature trends favorable for corn growth stage. Accumulated growing degree days: 145 (12% above average).</p>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 transition-all duration-200 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-5 w-5 text-accent" />
                      <h3 className="font-medium text-accent-foreground">Field Operations</h3>
                    </div>
                    <p className="text-sm text-foreground">Optimal spraying conditions on Friday and Saturday. Low wind, no precipitation, temperatures below 85°F.</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-background">
                  <h3 className="font-medium mb-2 text-primary">7-Day Weather Impact Summary</h3>
                  <ul className="space-y-2">
                    <li className="text-sm flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 font-medium px-1.5 py-0.5 rounded text-xs">Favorable</span>
                      <span className="text-foreground">Weekend weather optimal for planting and field operations</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 font-medium px-1.5 py-0.5 rounded text-xs">Watch</span>
                      <span className="text-foreground">Wednesday rain may delay mid-week operations</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 font-medium px-1.5 py-0.5 rounded text-xs">Favorable</span>
                      <span className="text-foreground">Temperature trends positive for current growth stages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Weather;
