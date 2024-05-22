import { useEffect } from "react";
import Realtime from "./WeatherWidgets/Realtime";
import XDayForecast from "./WeatherWidgets/XDayForecast";

function WeatherDashboard() {
//   const { weatherData, loading, updateWeatherData } = useWeatherContext();

  useEffect(() => {

  }, []);

  return (
      <div>
        {/* <Realtime /> */}
        {/* <WeatherWidget location='amsterdam' timesteps={TimeStep.OneHour} /> */}
        {/* <XDayForecast />; */}
      </div>
  );
}

export default WeatherDashboard;
