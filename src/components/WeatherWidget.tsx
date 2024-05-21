// src/components/WeatherWidget.tsx
import { useEffect } from "react";
import { validVariable } from "../utils";
import XDayForecast from "./XDayForecast";
import { useWeatherContext } from "./WeatherContext";
import { TimeStep } from "../services/weatherService";

interface WeatherWidgetProps {
  location: string;
  timesteps: TimeStep;
}

// Creates a specifc block of weatherinformation based on timesteps ('1d', '1h', 'realtime')
// This is a generic Weather Widget. it creates react component instance based on the timestep so there is conditional rendering.
function WeatherWidget({ location, timesteps }: WeatherWidgetProps) {

  const { hourlyData, realTimeData, loading } = useWeatherContext();

  useEffect(() => {

  }, []);

  if (loading || !validVariable(hourlyData) || !validVariable(realTimeData)) {
    return <div>Loading...</div>;
  }

  switch (timesteps) {
    case TimeStep.OneDay:
      // Render daily weather information
      return <XDayForecast data={hourlyData} loading={loading} />;

    case TimeStep.OneHour:
      // Render hourly weather information
      return <></>;

    case TimeStep.Realtime:
      // Render real-time weather information
      return (
        <div>
          <h1>5-Day Weather Forecast</h1>
          <ul>
            {realTimeData && (
              (() => {
                console.log(realTimeData);
                return (
                  <li key={realTimeData.time}>
                    <p>Date: {new Date(realTimeData.time).toDateString()}</p>
                    <p>Average Temperature: {realTimeData.values.temperatureAvg}°C</p>
                    <p>
                      Precipitation Probability: {realTimeData.values.precipitationProbabilityAvg}%
                    </p>
                    <p>Average Wind Speed: {realTimeData.values.windSpeedAvg} m/s</p>
                  </li>
                );
              })()
            )}
          </ul>
        </div>
      );

      
    default:
      return <div>timelines is not set...</div>;
  }
}

export default WeatherWidget;
