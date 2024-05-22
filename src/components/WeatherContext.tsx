import React, { createContext, useEffect, useState, useContext } from "react";
import getWeather, { WeatherData, TimeStep, LocationData } from "../services/weatherService";
import Cookies from "js-cookie";
import { minMinutesPast } from "../utils";

interface WeatherContextType {
  dailyData: WeatherData[];
  hourlyData: WeatherData[];
  realTimeData: WeatherData | null;
  location: LocationData;
  loading: boolean;
  lastCalled: number | null;
  updateLoading: (param: boolean) => void;
  updateWeatherData: () => Promise<void>; // Function to update weather data,
  updateLocation: (param: LocationData) => void;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [dailyData, setDailyData] = useState<WeatherData[]>([]);
  const [hourlyData, setHourlyData] = useState<WeatherData[]>([]);
  const [realTimeData, setRealtimeData] = useState<WeatherData | null>(null);
  const defaultLocation: LocationData = {
    address: 'Amsterdam, Netherlands',
    lat: 52.3675734,
    lng: 4.9041389
  }

  const [location, setLocation] = useState<LocationData>(defaultLocation);
  const [lastCalled, setLastCalled] = useState<number | null>(null);

  const updateWeatherData = async () => {
    
    return new Promise<void>(async (resolve, reject) => {
      //manual safety feature to prevent hitting limit too fast (bcs vite HMR spams the api)
    if(lastCalled && !minMinutesPast(lastCalled, 3)) {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 1000);
      return;
    }

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
      resolve();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      reject(error);
    } finally {
      setLoading(false);
      
      const newLastCalled = Date.now();
      setLastCalled(newLastCalled);
      Cookies.set("lastCalled", newLastCalled.toString());
      resolve();
    }
    });
  };

  const updateLocation = (param: LocationData) => {
    setLocation(param);
  }

  const updateLoading = (param: boolean) => {
    setLoading(param)
  }

  //init
  useEffect(() => {
    const lastCalledFromCookie = Cookies.get("lastCalled");
    if (lastCalledFromCookie) {
      setLastCalled(parseInt(lastCalledFromCookie));
    } else { //only if no cookie call the updateWeatherData
      updateWeatherData();
    }

  }, []);


   // Call updateWeatherData when lastCalled is updated
  useEffect(() => {
    if (lastCalled !== null) {
      updateWeatherData();
    }
  }, [lastCalled]);

  return (
    <WeatherContext.Provider
      value={{ dailyData, hourlyData, realTimeData, location, loading, lastCalled, updateLoading, updateWeatherData, updateLocation }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
