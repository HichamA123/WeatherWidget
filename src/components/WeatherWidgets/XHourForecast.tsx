import { useEffect } from "react";
import { validVariable } from "../../utils";
import { useWeatherContext } from "../WeatherContext";
import {
  Box,
  Heading,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";


function XHourForecast({ }) {
  const { hourlyData, loading } = useWeatherContext();

  useEffect(() => {
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Heading>24-Hour Forecast</Heading>

      <Box border='1px' borderRadius='md'>
        <UnorderedList>
          {hourlyData && hourlyData.map((day: any) => {
            return (
              <ListItem key={day.time}>
                <p>Date: {new Date(day.time).toDateString()}</p>
                <p>Temperature: {day.values.temperature}°C</p>
                <p>
                  Precipitation Probability:{" "}
                  {day.values.precipitationProbability}%
                </p>
                <p>Wind Speed: {day.values.windSpeed} m/s</p>
              </ListItem>
            )
          })}
        </UnorderedList>
      </Box>

      <ul>

      </ul>
    </>
  );
}

export default XHourForecast;
