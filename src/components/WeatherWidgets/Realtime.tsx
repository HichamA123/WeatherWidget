import { useEffect } from "react";
import { validVariable } from "../../utils";
import { useWeatherContext } from "../WeatherContext";
import {
  Box,
  Flex,
  Heading,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

interface RealtimetProps {

}

// Creates a specifc block of weatherinformation based on timesteps ('1d', '1h', 'realtime')
// This is a generic Weather Widget. it creates react component instance based on the timestep so there is conditional rendering.
function Realtime({ }: RealtimetProps) {
  const {realTimeData, location, loading, dailyData } = useWeatherContext();

  useEffect(() => {
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render real-time weather information
  return (
    <Flex w="50%" alignItems='center' flexDirection='column' textAlign='center'>
      <Heading>{location? location.address: 'No Address'}</Heading>
      <Box border='1px' borderRadius='md'>
      <UnorderedList>
        {realTimeData && dailyData && 
          (() => {
            return (
              
              <ListItem key={realTimeData.time}>
                <p>Date: {new Date(realTimeData.time).toDateString()}</p>
                <p>
                  Average Temperature: {dailyData[0].values.temperatureAvg}°C
                </p>
                <p>
                  Precipitation Probability:{" "}
                  {dailyData[0].values.precipitationProbabilityAvg}%
                </p>
                <p>
                  Average Wind Speed: {dailyData[0].values.windSpeedAvg} m/s
                </p>
              </ListItem>
            );
          })()}
          </UnorderedList>
      </Box>
    </Flex>
  );
}

export default Realtime;
