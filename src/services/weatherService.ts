// src/services/weatherService.ts
import axios from "axios";
import {getForecastDailyData, getForecastHourlyData, getRealtimeData} from "./data";

const API_KEY = "3jCDvJabQ7rYNPMPw7yRaVYmYr0hKlLs";
const BASE_URL = "https://api.tomorrow.io/v4/weather/forecast";

export enum TimeStep {
  OneDay = "1d",
  OneHour = "1h",
  Realtime = "realtime"
}

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

function getParams(location : string, timesteps : TimeStep) {
  let fields: string[];

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

export interface WeatherData {
  time: string;
  values: {
    temperatureAvg?: number;
    precipitationProbabilityAvg?: number;
    windSpeedAvg?: number;
    temperature?: number;
    precipitationProbability?: number;
    windSpeed?: number;
  };
}

export interface LocationData {
  address: string; // NOTE: do not use address for fetching tomorrow api data. only lat and lng
  lat: number;
  lng: number;
}