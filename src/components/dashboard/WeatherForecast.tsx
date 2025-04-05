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

  if (!weather) return <div className="p-4">Loading weather...</div>;

  const forecast = weather.forecast.forecastday;
  const today = forecast[0];

  // Step 1: Filter days with high rainfall chances (e.g. >60%)
  const rainfallAlerts = forecast.filter(
    (day: any) => Number(day.day.daily_chance_of_rain) >= 60
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Weather Forecast</CardTitle>
        <p>{weather.location.name}, {weather.location.country}</p>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* 🌞 Today's Weather Summary */}
        <div className="flex justify-between items-center bg-blue-100 p-4 rounded">
          <div>
            <p className="text-xl font-bold">{today.day.condition.text}</p>
            <p className="text-sm">{today.date}</p>
          </div>
          <div className="text-2xl font-bold">
            {today.day.avgtemp_c}°C
          </div>
        </div>

        {/* 📅 7-Day Forecast */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {forecast.map((day: any) => (
            <div key={day.date} className="text-center p-2 border rounded">
              <p className="text-sm font-medium">{day.date}</p>
              <img
                src={day.day.condition.icon}
                alt={day.day.condition.text}
                className="mx-auto w-10"
              />
              <p className="font-semibold">{day.day.avgtemp_c}°C</p>
              <p className="text-xs">{day.day.condition.text}</p>
              <p className="text-xs text-blue-500">
                💧 Rain: {day.day.daily_chance_of_rain}%
              </p>
            </div>
          ))}
        </div>

        {/* 🌧️ Rainfall Alerts */}
        {rainfallAlerts.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4 rounded">
            <div className="flex items-center gap-2 font-medium text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Rainfall Alert
            </div>
            <ul className="mt-2 text-sm text-yellow-700 list-disc ml-6">
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
};
