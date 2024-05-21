import { useEffect } from "react";
import { validVariable } from "../../utils";
import { useWeatherContext } from "../WeatherContext";

interface XDayForecastProps {}

//   {data, loading}: {data: WeatherData[], loading: Boolean}
function XDayForecast({}: XDayForecastProps) {
  const {dailyData, hourlyData, realTimeData, location, loading } = useWeatherContext();

  useEffect(() => {
    console.log("the data: ", dailyData);
  }, [dailyData]);

  if (loading || !validVariable(dailyData) || !validVariable(realTimeData)) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>5-Day Weather Forecast</h1>
      <ul>
        {dailyData.map((day: any) => {
          return (
          <li key={day.time}>
            <p>Date: {new Date(day.time).toDateString()}</p>
            <p>Average Temperature: {day.values.temperatureAvg}°C</p>
            <p>
              Precipitation Probability:{" "}
              {day.values.precipitationProbabilityAvg}%
            </p>
            <p>Average Wind Speed: {day.values.windSpeedAvg} m/s</p>
          </li>
        )})}
      </ul>
    </div>
  );
}

export default XDayForecast;
