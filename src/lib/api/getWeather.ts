export const getWeather = async (lat: number, lon: number) => {
  const apiKey = "f61792db477a4f3091f93634250504";
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
  );
  
  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await res.json();
  return data;
};
