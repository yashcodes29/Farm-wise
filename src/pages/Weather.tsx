
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CloudDrizzle, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getWeather } from "@/lib/api/getWeather";

const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const data = await getWeather(lat, lon);
        setWeather(data);
        setLocation(`${data.location.name}, ${data.location.region || data.location.country}`);
      } catch (err) {
        setLocation("Location unavailable");
      } finally {
        setLoading(false);
      }
    }, () => {
      setLocation("Location unavailable");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-center text-primary animate-bounce">🌦️ Loading weather...</div>;
  if (!weather) return <div className="p-6 text-center text-red-500 animate-shake">❌ Unable to fetch weather data.</div>;

  const forecast = weather.forecast.forecastday;
  const today = forecast[0];
  const hourlyData = today.hour; // <-- Use real hourly data

  // Dynamic Farm Impact logic
  // 1. Irrigation: If any day in next 3 has rain > 60%, suggest skipping irrigation
  const nextRainDay = forecast.find((d: any, i: number) => i < 3 && Number(d.day.daily_chance_of_rain) > 60);
  const irrigationAdvice = nextRainDay
    ? `Rainfall expected on ${nextRainDay.date} (${nextRainDay.day.daily_chance_of_rain}% chance). Consider skipping irrigation before this day.`
    : "No significant rainfall expected in the next 3 days. Maintain regular irrigation schedule.";

  // 2. Crop Development: Use average temp for next 7 days
  const avgTemp = Math.round(forecast.reduce((sum: number, d: any) => sum + d.day.avgtemp_c, 0) / forecast.length);
  let cropAdvice = "Temperature trends are normal for crop growth.";
  if (avgTemp > 32) cropAdvice = "High average temperatures may stress crops. Monitor soil moisture and consider mulching.";
  else if (avgTemp < 18) cropAdvice = "Cooler than usual temperatures may slow crop development.";

  // 3. Field Operations: Look for days with low wind (<10kph), no rain, temp < 30C
  const bestFieldDay = forecast.find((d: any) => d.day.maxwind_kph < 10 && Number(d.day.daily_chance_of_rain) < 20 && d.day.maxtemp_c < 30);
  const fieldAdvice = bestFieldDay
    ? `Optimal field work conditions on ${bestFieldDay.date}: low wind, low rain chance, moderate temperature.`
    : "No ideal field operation window in the next 7 days. Monitor daily for best conditions.";

  // 4. Impact summary
  const summary: { label: string; type: string; text: string }[] = [];
  if (nextRainDay) summary.push({ label: "Rain Alert", type: "amber", text: `Rain expected on ${nextRainDay.date} may delay operations.` });
  if (bestFieldDay) summary.push({ label: "Favorable", type: "green", text: `Best field work day: ${bestFieldDay.date}` });
  if (avgTemp > 32) summary.push({ label: "Heat", type: "amber", text: "High temps may stress crops." });
  if (avgTemp < 18) summary.push({ label: "Cool", type: "blue", text: "Cool temps may slow growth." });
  if (summary.length === 0) summary.push({ label: "Normal", type: "green", text: "No major weather risks this week." });

  // For charts
  const temperatureData = forecast.map((day: any) => ({
    name: day.date,
    high: day.day.maxtemp_c,
    low: day.day.mintemp_c
  }));
  const precipitationData = forecast.map((day: any) => ({
    name: day.date,
    precipitation: day.day.daily_chance_of_rain
  }));

  return (
    <>
      <div className="mb-8 animate-fade-in flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow flex items-center gap-2">🌦️ Weather Forecast</h1>
        <p className="text-lg text-secondary-foreground mt-1 flex items-center gap-2">7-day forecast and weather impacts for <span className="font-semibold text-primary">{location}</span> <span className="animate-bounce">📍</span></p>
      </div>

      <Tabs defaultValue="forecast" className="mb-8">
        <TabsList className="bg-background border border-border">
          <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">🌤️ Forecast</TabsTrigger>
          <TabsTrigger value="hourly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">⏰ Hourly</TabsTrigger>
          <TabsTrigger value="impact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">🌾 Farm Impact</TabsTrigger>
        </TabsList>
        <TabsContent value="forecast" className="space-y-6 animate-fade-in">
          {/* Daily cards */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {forecast.map((day: any, index: number) => (
              <Card key={day.date} className={`transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-2 flex flex-col items-center">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long' })} {day.day.condition.text.includes('Rain') ? '🌧️' : day.day.condition.text.includes('Sunny') ? '☀️' : '⛅'}</CardTitle>
                  <CardDescription className="text-secondary-foreground">{day.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-1">
                    <img src={day.day.condition.icon} alt={day.day.condition.text} className="h-8 w-8 animate-bounce-in" />
                    <p className="text-sm text-foreground">{day.day.condition.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-primary">{day.day.maxtemp_c}°</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="text-sm">{day.day.mintemp_c}°</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Droplets className="h-3 w-3 text-accent" />
                      <span className="text-xs text-accent-foreground">{day.day.daily_chance_of_rain}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="transition-all duration-300 hover:shadow-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">📈 Temperature Trend</CardTitle>
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
            <Card className="transition-all duration-300 hover:shadow-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">💧 Precipitation Forecast</CardTitle>
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
          <Card className="transition-all duration-300 hover:shadow-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">⏰ Hourly Forecast</CardTitle>
              <CardDescription className="text-secondary-foreground">Detailed 24-hour forecast for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {hourlyData.map((hour: any, idx: number) => (
                    <div
                      key={hour.time_epoch}
                      className={`flex flex-col items-center p-4 rounded-lg min-w-[80px] transition-all duration-200 hover:scale-110 hover:shadow-xl animate-fade-in ${
                        idx === 12 ? "bg-primary/10 border border-primary/20" : "bg-background border border-border"
                      }`}
                    >
                      <span className="text-xs font-medium text-foreground">{hour.time.slice(-5)}</span>
                      <img src={hour.condition.icon} alt={hour.condition.text} className="h-6 w-6 my-2 animate-bounce-in" />
                      <span className="text-sm font-bold text-primary">{hour.temp_c}°</span>
                      <div className="flex items-center mt-1">
                        <Droplets className="h-3 w-3 text-accent mr-1" />
                        <span className="text-xs text-accent-foreground">{hour.chance_of_rain}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-center mt-1">{hour.condition.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="impact" className="animate-fade-in">
          <Card className="transition-all duration-300 hover:shadow-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">🌾 Weather Impact Analysis</CardTitle>
              <CardDescription className="text-secondary-foreground">How current and upcoming weather affects your farm operations in <span className="font-semibold text-primary">{location}</span> <span className="animate-bounce">🚜</span></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 transition-all duration-200 hover:scale-105 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-primary">💧 Irrigation Needs</h3>
                    </div>
                    <p className="text-sm text-foreground">{irrigationAdvice}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 transition-all duration-200 hover:scale-105 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5 text-secondary" />
                      <h3 className="font-medium text-secondary">🌱 Crop Development</h3>
                    </div>
                    <p className="text-sm text-foreground">{cropAdvice}</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 transition-all duration-200 hover:scale-105 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-5 w-5 text-accent" />
                      <h3 className="font-medium text-accent-foreground">🛠️ Field Operations</h3>
                    </div>
                    <p className="text-sm text-foreground">{fieldAdvice}</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-background animate-fade-in">
                  <h3 className="font-medium mb-2 text-primary flex items-center gap-2">📝 7-Day Weather Impact Summary</h3>
                  <ul className="space-y-2">
                    {summary.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${item.type === "green" ? "bg-green-100 text-green-800" : item.type === "amber" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>{item.label}</span>
                        <span className="text-foreground">{item.text}</span>
                      </li>
                    ))}
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
