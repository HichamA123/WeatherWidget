import { useEffect } from "react";
import { validVariable } from "../../utils";
import { useWeatherContext } from "../WeatherContext";
import {
  Box,
  Heading,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

interface XDayForecastProps { }

//   {data, loading}: {data: WeatherData[], loading: Boolean}
function XDayForecast({ }: XDayForecastProps) {
  const { dailyData, loading } = useWeatherContext();

  useEffect(() => {

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Heading>5-Day Weather Forecast</Heading>
      <Box border='1px' borderRadius='md'>
        <UnorderedList>
          {dailyData && dailyData.map((day: any) => {
            return (
              <ListItem key={day.time}>
                <p>Date: {new Date(day.time).toDateString()}</p>
                <p>Average Temperature: {day.values.temperatureAvg}°C</p>
                <p>
                  Precipitation Probability:{" "}
                  {day.values.precipitationProbabilityAvg}%
                </p>
                <p>Average Wind Speed: {day.values.windSpeedAvg} m/s</p>
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

export default XDayForecast;
