// src/components/WeatherWidget.tsx
import { useEffect, useState } from "react";
import getWeather, { WeatherData } from "../services/weatherService";

interface WeatherWidgetProps {
  lat: number;
  lon: number;
}

function WeatherWidget({ lat, lon }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather({ lat, lon }); // New York coordinates
        
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>5-Day Weather Forecast</h1>
      <ul>
        {weatherData.map((day) => (
          <li key={day.time}>
            <p>Date: {new Date(day.time).toDateString()}</p>
            <p>Average Temperature: {day.values.temperatureAvg}°C</p>
            <p>Precipitation Probability: {day.values.precipitationProbabilityAvg}%</p>
            <p>Average Wind Speed: {day.values.windSpeedAvg} m/s</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherWidget;
