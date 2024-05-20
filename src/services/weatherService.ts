// src/services/weatherService.ts
import axios from 'axios';

const API_KEY = '3jCDvJabQ7rYNPMPw7yRaVYmYr0hKlLs';
const BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';


//TODO geen api calls maken naar de api. 1 keer data kopieeren hier returnen en daarmee werken ipv elke keer callen.

interface WeatherResponse {

    timelines: {
      daily: Array<{
        time: string;
        values: {
          temperatureAvg: number;
          precipitationProbabilityAvg: number;
          windSpeedAvg: number;
        };
      }>;
    };

}

const getWeather = async (location: { lat: number; lon: number }) => {
  const params = {
    location: `${location.lat},${location.lon}`,
    fields: ['temperatureAvg', 'precipitationProbabilityAvg', 'windSpeedAvg'],
    units: 'metric',
    timesteps: '1d',
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    apikey: API_KEY,
  };

  const response = await axios.get<WeatherResponse>(BASE_URL, { params });
  const data: WeatherData[] = response.data.timelines.daily;

  console.log(data); //TODO test the result

  return data;
};

export interface WeatherData {
  time: string;
  values: {
    temperatureAvg: number;
    precipitationProbabilityAvg: number;
    windSpeedAvg: number;
  }
  
}

export default getWeather;
