// src/services/weatherService.ts
import axios from "axios";
import {getForecastDailyData, getForecastHourlyData, getRealtimeData} from "./data";

// credentials
const API_KEY = import.meta.env.VITE_TOMORROWIO_API_KEY;
const BASE_URL = "https://api.tomorrow.io/v4/weather/forecast";


export enum TimeStep {
  OneDay = "1d",
  OneHour = "1h",
  Realtime = "realtime"
}

//response interfaces (could be written better)
interface DailyWeatherResponse {
  timelines: {
    daily: Array < {
      time: string;
      values: {
        temperatureAvg: number;
        precipitationProbabilityAvg: number;
        windSpeedAvg: number;
      };
    } >;
  };
}

interface HourlyWeatherResponse {
  timelines: {
    hourly: Array < {
      time: string;
      values: {
        temperature: number;
        precipitationProbability: number;
        windSpeed: number;
      };
    } >;
  };
}

interface RealtimeWeatherResponse {
  data: {
    time: string;
    values: {
      temperature: number;
      precipitationProbability: number;
      windSpeed: number;
    };
  };
}

// returns the parameters
function getParams(location : string, timesteps : TimeStep) {
  let fields: string[];

  //TODO specify all the necessary fields here
  switch (timesteps) {
    case TimeStep.OneDay:
      fields = ["temperatureAvg", "precipitationProbabilityAvg", "windSpeedAvg"];
      break;
    case TimeStep.OneHour:
      fields = ["temperature", "precipitationProbability", "windSpeed"];
      break;
    case TimeStep.Realtime:
      fields = ["temperature", "precipitationProbability", "windSpeed"];
      break;
    default:
      throw new Error("Invalid forecast type");
  }

  //TODO check if the starttime is valid or not
  return {
    location,
    fields,
    units: "metric",
    timesteps: timesteps === "realtime"
      ? timesteps
      : "",
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + (
      timesteps === "1d"
      ? 5
      : 1))).toISOString(),
    apikey: API_KEY
  };
}


// calls the api to fetch weather data based on timestep (realtime, daily, hourly) and the location
export default async function getWeather(location : LocationData, timesteps : TimeStep): Promise<WeatherData[] | WeatherData> {
  const params = getParams(`${location.lat}, ${location.lng}`, timesteps);

  //TODO use this again
  // const response = await axios.get<DailyWeatherResponse>(BASE_URL, { params });
  // const data: WeatherData[] = response.data.timelines.daily;

  let data: WeatherData[] = [];
  let response;

  switch (timesteps) {
    case TimeStep.OneDay:
      response = (await getForecastDailyData())as DailyWeatherResponse;
      data = response.timelines.daily;
      return data;

    case TimeStep.OneHour:
      response = (await getForecastHourlyData())as HourlyWeatherResponse;
      data = response.timelines.hourly;
      return data;

    case TimeStep.Realtime:
      response = (await getRealtimeData())as RealtimeWeatherResponse;
      let single: WeatherData = response.data;
      return single;
    default:
      throw new Error("Invalid forecast type");
  }

}


// all the properties that we can receive from the api
export interface WeatherData {
  time: string;
  values: {
    cloudCover?: number;
    cloudCoverAvg?: number;
    visibility?: number;
    temperature?: number;
    temperatureAvg?: number;
    temperatureMin?: number;
    temperatureMax?: number;
    humidity?: number;
    humidityAvg?: number;
    temperatureApparent?: number;
    temperatureApparentAvg?: number;
    uvIndex?: number;
    uvIndexAvg?: number;
    uvIndexMax?: number;
    uvIndexMin?: number;
    precipitationProbability?: number;
    precipitationProbabilityAvg?: number;
    pressureSurfaceLevel?: number;
    pressureSurfaceLevelAvg?: number;
    rainIntensity?: number;
    rainIntensityAvg?: number;
    snowIntensity?: number;
    snowIntensityAvg?: number;
    sleetIntensity?: number;
    windSpeed?: number;
    windSpeedAvg?: number;
    windDirection?: number;
    sunriseTime?: string;
    sunsetTime?: string;
    
  };
}

// is used to store location data according a format
export interface LocationData {
  address: string; // NOTE: do not use address for fetching tomorrow api data. only lat and lng
  lat: number;
  lng: number;
}