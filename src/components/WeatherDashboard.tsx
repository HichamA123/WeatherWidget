import { useEffect } from "react";
import Realtime from "./WeatherWidgets/Realtime";
import XDayForecast from "./WeatherWidgets/XDayForecast";
import XHourForecast from "./WeatherWidgets/XHourForecast";

import {
  Box,
  Flex,
} from "@chakra-ui/react";

function WeatherDashboard() {
//   const { weatherData, loading } = useWeatherContext();

  useEffect(() => {

  }, []);

  return (
      <Flex w='97%' mt='4' p='3'  alignItems='flex-start' gap='6' border='none'>
        <Flex flexDir='column' w='50%' mx='7' gap='5'>
          <Realtime />
        </Flex>
        {/* <Flex flexDirection='column' w='50%' alignItems='center'> */}
        {/* <XHourForecast />; */}
        {/* <XDayForecast />; */}
        {/* </Flex> */}
      </Flex>
  );
}

export default WeatherDashboard;
