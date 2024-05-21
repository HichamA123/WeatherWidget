import { useEffect } from "react";
import { WeatherProvider } from "./WeatherContext";
import Realtime from "./WeatherWidgets/Realtime";
import XDayForecast from "./WeatherWidgets/XDayForecast";

function WeatherDashboard() {
//   const { weatherData, loading, updateWeatherData } = useWeatherContext();

  useEffect(() => {

  }, []);

  return (
    <WeatherProvider>
      <div>
        <Realtime />
        {/* <WeatherWidget location='amsterdam' timesteps={TimeStep.OneHour} /> */}
        <XDayForecast />;
      </div>
    </WeatherProvider>
  );
}

export default WeatherDashboard;
