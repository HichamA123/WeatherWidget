// src/services/weatherService.ts
import axios from 'axios';

const API_KEY = '3jCDvJabQ7rYNPMPw7yRaVYmYr0hKlLs';
const BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';

const getWeather = async (location: { lat: number; lon: number }) => {
  const params = {
    location: `${location.lat},${location.lon}`,
    fields: ['temperature', 'precipitationProbability', 'windSpeed'],
    units: 'metric',
    timesteps: '1d',
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    apikey: API_KEY,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
};

export default getWeather;
