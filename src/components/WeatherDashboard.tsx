import WeatherWidget from "./WeatherWidget";
import { useEffect } from "react";
import { WeatherProvider } from "./WeatherContext";
import { TimeStep } from "../services/weatherService";

//TODO only fetch 1h and current. no need for daily. create the daily array with weatherData.filter or something like that
function WeatherDashboard() {
//   const { weatherData, loading, updateWeatherData } = useWeatherContext();

  useEffect(() => {

  }, []);

  return (
    <WeatherProvider>
      <div>
        <WeatherWidget location="amsterdam" timesteps={TimeStep.Realtime} />
        {/* <WeatherWidget location='amsterdam' timesteps={TimeStep.OneDay} /> */}
        {/* <WeatherWidget location='amsterdam' timesteps={TimeStep.OneHour} /> */}
      </div>
    </WeatherProvider>
  );
}

export default WeatherDashboard;
