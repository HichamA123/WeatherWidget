import React, { createContext, useEffect, useState, useContext } from "react";
import getWeather, { WeatherData, TimeStep } from "../services/weatherService";

interface WeatherContextType {
  dailyData: WeatherData[];
  hourlyData: WeatherData[];
  realTimeData: WeatherData | null;
  location: string;
  loading: boolean;
  updateWeatherData: () => void; // Function to update weather data
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
}

export function WeatherProvider({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [dailyData, setDailyData] = useState<WeatherData[]>([]);
  const [hourlyData, setHourlyData] = useState<WeatherData[]>([]);
  const [realTimeData, setRealtimeData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState("amsterdam"); //TODO create navbar and bind it to the navbar to search on location

  const updateWeatherData = async () => {
    setLoading(true);
    try {
      let response: WeatherData[] | WeatherData;

      // daily data
      response = (await getWeather(
        location,
        TimeStep.OneDay
      )) as WeatherData[];

      setDailyData(response);

      //hourly data
      response = (await getWeather(
        location,
        TimeStep.OneHour
      )) as WeatherData[];

      setHourlyData(response);
      // realtime data
      response = (await getWeather(location, TimeStep.Realtime)) as WeatherData;

      setRealtimeData(response);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  //init
  useEffect(() => {
    updateWeatherData();
  }, []);

  return (
    <WeatherContext.Provider
      value={{ dailyData, hourlyData, realTimeData, location, loading, updateWeatherData }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
