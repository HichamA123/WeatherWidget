import { useEffect } from "react";
import { validVariable } from "../../utils";
import { useWeatherContext } from "../WeatherContext";

interface RealtimetProps {

}

// Creates a specifc block of weatherinformation based on timesteps ('1d', '1h', 'realtime')
// This is a generic Weather Widget. it creates react component instance based on the timestep so there is conditional rendering.
function Realtime({ }: RealtimetProps) {
  const {realTimeData, hourlyData, location, loading } = useWeatherContext();

  useEffect(() => {}, []);

  if (loading || !validVariable(hourlyData) || !validVariable(realTimeData)) {
    return <div>Loading...</div>;
  }

  // Render real-time weather information
  return (
    <div>
      <h1>Now</h1>
      <ul>
        {realTimeData &&
          (() => {
            return (
              <li key={realTimeData.time}>
                <p>Date: {new Date(realTimeData.time).toDateString()}</p>
                <p>
                  Average Temperature: {realTimeData.values.temperatureAvg}°C
                </p>
                <p>
                  Precipitation Probability:{" "}
                  {realTimeData.values.precipitationProbabilityAvg}%
                </p>
                <p>
                  Average Wind Speed: {realTimeData.values.windSpeedAvg} m/s
                </p>
              </li>
            );
          })()}
      </ul>
    </div>
  );
}

export default Realtime;
