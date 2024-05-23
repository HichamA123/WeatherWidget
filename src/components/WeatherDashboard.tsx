import { useEffect } from "react";
import Realtime from "./WeatherWidgets/Realtime";
import Forecast from "./WeatherWidgets/Forecast";

import {
  Box,
  Flex,
} from "@chakra-ui/react";

function WeatherDashboard() {

  useEffect(() => {

  }, []);

  return (
    <Flex w='97%' mt='4' p='3' alignItems='flex-start' gap='6' h="100%" flexDir={{base: 'column', lg: 'row'}}>
      <Flex flexDir='column' w={{base: '100%', lg: '50%'}} gap='5'>
        <Realtime />
      </Flex>
      <Flex flexDir='column' w={{base: '100%', lg: '50%'}}  gap='5'>
        <Forecast />
      </Flex>
    </Flex>
  );
}

export default WeatherDashboard;
