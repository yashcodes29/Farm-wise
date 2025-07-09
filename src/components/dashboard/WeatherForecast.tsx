import { useEffect, useState } from "react";
import { getWeather } from "@/lib/api/getWeather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, CloudRain, Cloud, Thermometer, AlertTriangle } from "lucide-react";

export const WeatherForecast = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const data = await getWeather(lat, lon);
        setWeather(data);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  if (!weather) return <div className="p-4 text-primary">Loading weather...</div>;

  const forecast = weather.forecast.forecastday;
  const today = forecast[0];

  // Step 1: Filter days with high rainfall chances (e.g. >60%)
  const rainfallAlerts = forecast.filter(
    (day: any) => Number(day.day.daily_chance_of_rain) >= 60
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">7-Day Weather Forecast</CardTitle>
        <p className="text-secondary-foreground">{weather.location.name}, {weather.location.country}</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* 🌞 Today's Weather Summary */}
        <div className="flex justify-between items-center bg-primary/10 p-4 rounded">
          <div>
            <p className="text-xl font-bold text-primary">{today.day.condition.text}</p>
            <p className="text-sm text-muted-foreground">{today.date}</p>
          </div>
          <div className="text-2xl font-bold text-primary">
            {today.day.avgtemp_c}°C
          </div>
        </div>
        {/* 📅 7-Day Forecast */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {forecast.map((day: any) => (
            <div key={day.date} className="text-center p-2 border rounded bg-background">
              <p className="text-sm font-medium text-foreground">{day.date}</p>
              <img
                src={day.day.condition.icon}
                alt={day.day.condition.text}
                className="mx-auto w-10"
              />
              <p className="font-semibold text-primary">{day.day.avgtemp_c}°C</p>
              <p className="text-xs text-muted-foreground">{day.day.condition.text}</p>
              <p className="text-xs text-accent">
                💧 Rain: {day.day.daily_chance_of_rain}%
              </p>
            </div>
          ))}
        </div>
        {/* 🌧️ Rainfall Alerts */}
        {rainfallAlerts.length > 0 && (
          <div className="bg-accent/10 border-l-4 border-accent p-4 mt-4 rounded">
            <div className="flex items-center gap-2 font-medium text-accent-foreground">
              <AlertTriangle className="h-5 w-5" />
              Rainfall Alert
            </div>
            <ul className="mt-2 text-sm text-accent-foreground list-disc ml-6">
              {rainfallAlerts.map((day: any) => (
                <li key={day.date}>
                  {day.date}: {day.day.condition.text} –{" "}
                  {day.day.daily_chance_of_rain}% chance of rain. 
                  {Number(day.day.daily_chance_of_rain) >= 80
                    ? " ⚠️ Heavy rain expected. Plan irrigation and field access."
                    : " Moderate rain – monitor field conditions."}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
