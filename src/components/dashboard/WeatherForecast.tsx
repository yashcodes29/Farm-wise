
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Thermometer } from "lucide-react";

const weatherData = [
  { 
    day: "Today", 
    temp: 75, 
    condition: "Sunny", 
    icon: Sun,
    precipitation: "0%",
    humidity: "45%",
    wind: "8 mph"
  },
  { 
    day: "Tomorrow", 
    temp: 72, 
    condition: "Partly Cloudy", 
    icon: Cloud,
    precipitation: "10%",
    humidity: "50%",
    wind: "10 mph" 
  },
  { 
    day: "Wednesday", 
    temp: 68, 
    condition: "Rain", 
    icon: CloudRain,
    precipitation: "80%",
    humidity: "75%",
    wind: "12 mph"
  },
  { 
    day: "Thursday", 
    temp: 71, 
    condition: "Partly Cloudy", 
    icon: Cloud,
    precipitation: "20%",
    humidity: "55%",
    wind: "7 mph"
  },
  { 
    day: "Friday", 
    temp: 78, 
    condition: "Sunny", 
    icon: Sun,
    precipitation: "0%",
    humidity: "40%",
    wind: "5 mph"
  },
  { 
    day: "Saturday", 
    temp: 80, 
    condition: "Sunny", 
    icon: Sun,
    precipitation: "0%",
    humidity: "35%",
    wind: "4 mph"
  },
  { 
    day: "Sunday", 
    temp: 76, 
    condition: "Partly Cloudy", 
    icon: Cloud,
    precipitation: "10%",
    humidity: "45%",
    wind: "6 mph"
  },
];

export const WeatherForecast = () => {
  // Today's details
  const today = weatherData[0];

  return (
    <Card className="h-full">
      <CardHeader className="bg-farm-sky-light/10">
        <CardTitle className="text-farm-sky-dark">7-Day Weather Forecast</CardTitle>
        <CardDescription>Local weather predictions for your farm area</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {/* Today's detailed weather */}
          <div className="flex items-center justify-between p-4 bg-farm-sky-light/5 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-farm-sky-light/20 p-3 rounded-full">
                <today.icon className="h-8 w-8 text-farm-sky-dark" />
              </div>
              <div>
                <p className="text-lg font-medium">{today.condition}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                <span className="text-2xl font-bold">{today.temp}°</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span>Precip: {today.precipitation}</span> • 
                <span> Humidity: {today.humidity}</span> • 
                <span> Wind: {today.wind}</span>
              </div>
            </div>
          </div>
          
          {/* 7-day forecast */}
          <div className="grid grid-cols-7 gap-2">
            {weatherData.map((day, i) => (
              <div key={day.day} className="text-center p-2">
                <p className="text-xs font-medium">{day.day}</p>
                <day.icon className="h-5 w-5 mx-auto my-2" />
                <p className="text-sm font-medium">{day.temp}°</p>
                <p className="text-xs text-muted-foreground">{day.precipitation}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-2">
            <p className="text-sm font-medium">Weather Impact Alert</p>
            <p className="text-xs text-muted-foreground mt-1">
              Rainfall expected on Wednesday - consider adjusting irrigation schedules. Optimal planting conditions this weekend.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
