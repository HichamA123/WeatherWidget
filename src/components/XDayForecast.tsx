import { useEffect } from "react";
import { WeatherData } from "../services/weatherService";
import { validVariable } from "../utils";

interface XDayForecastProps {
    data: WeatherData[];
    loading: Boolean;
  }

//   {data, loading}: {data: WeatherData[], loading: Boolean}
function XDayForecast({data, loading}: XDayForecastProps) {

  useEffect(() => {
    if (!validVariable(data)) return;

  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>5-Day Weather Forecast</h1>
      <ul>
        {data.map((day) => (
          <li key={day.time}>
            <p>Date: {new Date(day.time).toDateString()}</p>
            <p>Average Temperature: {day.values.temperatureAvg}°C</p>
            <p>
              Precipitation Probability:{" "}
              {day.values.precipitationProbabilityAvg}%
            </p>
            <p>Average Wind Speed: {day.values.windSpeedAvg} m/s</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default XDayForecast;
