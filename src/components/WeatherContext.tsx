import { createContext, useEffect, useState, useContext } from "react";
import getWeather, { WeatherData, TimeStep, LocationData } from "../services/weatherService";
import Cookies from "js-cookie";
import { timeoutIsDone } from "../utils";
import { useToast } from "@chakra-ui/react";

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

// the context used by the entire app (no need for seperating into multiple contexts)
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// this method is used globally to save code
export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
}

export function WeatherProvider({ children }: { children: any }) {
  // loading state when fetching data from api's
  const [loading, setLoading] = useState<boolean>(false);
  // daily data from weather api
  const [dailyData, setDailyData] = useState<WeatherData[]>([]);
  // hourly data from weather api
  const [hourlyData, setHourlyData] = useState<WeatherData[]>([]);
  // hourly data from weather api
  const [realTimeData, setRealtimeData] = useState<WeatherData | null>(null);
  // to display succes or error messages when fetching from weather api
  const toast = useToast();
  const defaultLocation: LocationData = { //is used by default if nothing is cached in the cookies
    address: 'Amsterdam, Netherlands',
    lat: 52.3675734,
    lng: 4.9041389
  }

  //cached in browser cookies
  const [location, setLocation] = useState<LocationData>(defaultLocation);
  // is used to throttle the weather api calling, i have limited use on the api ;)
  const [lastCalled, setLastCalled] = useState<number | null>(null);

  // fetches the data from weather api and sets in the correct state
  const updateWeatherData = async () => {

    return new Promise<void>(async (resolve, reject) => {
      //manual safety feature to prevent hitting limit too fast (bcs vite HMR spams the api)
      if (lastCalled && !timeoutIsDone(lastCalled)) {
        setTimeout(() => {
          setLoading(false);
          resolve();
        }, 1000);
        return;
      }

      console.log("the location and lastcalled: ", location.address, " ", lastCalled);
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

        toast({
          title: "Updated weather data",
          description: `${location.address}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        resolve(); // somehow the finally block still gets called...
      } catch (error) {
        console.error("Error fetching weather data:", error);

        toast({
          title: "Fetching weather data failed",
          description: `Error: ${error}, Please contact customer support (hicham)`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

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
    Cookies.set("location", JSON.stringify(param)); // set location in cookies
  }

  const updateLoading = (param: boolean) => {
    setLoading(param)
  }

  //init
  useEffect(() => { // fetch and set the cookies values if they exist
    const lastCalledFromCookie = Cookies.get("lastCalled");
    const locationFromCookie = Cookies.get("location");

    if (locationFromCookie) {
      const parsedLocation: LocationData = JSON.parse(locationFromCookie);
      setLocation(parsedLocation);
    }

    if (lastCalledFromCookie) {
      setLastCalled(parseInt(lastCalledFromCookie));
    } else { //only if no lastcalled cookie, to prevent double calling method
      // bcs the setlocation and setlastcalled are async, the method below will not have the latest data, so 2nd useffect is used below
      updateWeatherData();

    }

  }, []);


  // Call when lastCalled is updated or when location is updated
  // everytime location gets updated, this will be called
  useEffect(() => {
    if (lastCalled !== null) {
      updateWeatherData();
    }
  }, [lastCalled, location]);

  return (
    <WeatherContext.Provider
    //passing all the state values and relevant methods to context for use globally
      value={{ dailyData, hourlyData, realTimeData, location, loading, lastCalled, updateLoading, updateWeatherData, updateLocation }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
