import { useEffect } from "react";
import { useWeatherContext } from "../WeatherContext";
import {
  Box,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Spacer,
  Text,
  Divider,
  Circle,
  Icon,
  Center
} from "@chakra-ui/react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { BiSun, BiMoon } from "react-icons/bi";
import { weatherIcon } from "../../utils";
import { ForecastType } from "./Forecast";


function Sun({ rise, set }: { rise: string; set: string; }) {

  const parseTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card w="100%" h="50%" bgColor="rgba(0, 0, 0, 0.05)" color="white">
      <CardHeader>
        <Heading size='md'>Day & night</Heading>
      </CardHeader>
      <CardBody w="100%" color="rgba(255, 255, 255, 0.7)">
        <Stack>
          <Flex flexDir='row' alignItems='center' w="100%">
            <Icon as={BiSun} boxSize={8} />
            <Spacer />
            <Heading mr={2} size={['md', null, null, 'md', 'lg', 'xl']} >{parseTime(rise)}</Heading>
            <Text fontSize='lg'>Sunrise</Text>
            <Spacer />
          </Flex>
          <Flex flexDir='row' alignItems='center' mt={2} w="100%">
            <Icon as={BiMoon} boxSize={8} />
            <Spacer />
            <Heading mr={2} size={['md', null, null, 'md', 'lg', 'xl']} >{parseTime(set)}</Heading>
            <Text fontSize='lg'>Sunset</Text>
            <Spacer />
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}

function Temperature({ realTimeData, tempMin, tempMax, sunriseTime, sunsetTime }: { realTimeData: any; tempMin: number; tempMax: number; sunriseTime: string|null, sunsetTime: string|null }) {

  const weatherMood = (data: any): string => {
    // Extract relevant data from realTimeData
    const { cloudCover, visibility, windSpeed, rainIntensity, snowIntensity, sleetIntensity, uvIndex } = data;
    // Determine the weather mood based on the extracted data
    if (rainIntensity > 5) return "Rainy"; // mm/hour
    else if (snowIntensity > 1) return "Snowy"; // mm/hour
    else if (sleetIntensity > 1) return "Sleet"; // mm/hour
    else if (visibility < 5) return "Foggy"; //km
    else if (cloudCover > 80) return "Cloudy"; // %
    else if (windSpeed > 25) return "Windy"; // m/s
    else if (uvIndex > 4) return "Sunny"; // > 5 = a lot of sun
    else return "Clear";
  };

  if (!realTimeData) {
    return null;
  }

  return (
    <Card w="100%" alignItems='center' bgColor="rgba(0, 0, 0, 0.1)" color="white">
      <CardHeader>
        <Heading fontSize="5rem" ml={5}>{Math.round(realTimeData.temperature)}
          <Text as="sup">&deg;C</Text>
        </Heading>
        <Flex alignItems='center' justifyContent='center' mt={5}>
          <Icon as={weatherIcon(realTimeData, ForecastType.realtime, sunriseTime, sunsetTime)} boxSize={14} />
        </Flex>
      </CardHeader>
      <CardBody w="100%">
        
        <Flex alignItems='center'>
          <Spacer />
          <Heading fontSize='xx-large'>{weatherMood(realTimeData)}</Heading>
          <Spacer />
          <Heading fontSize='xl'>{Math.round(tempMax)}<Text as="sup">&deg;C</Text> / {Math.round(tempMin)}<Text as="sup">&deg;C</Text></Heading>
          <Spacer />
        </Flex>
      </CardBody>
    </Card>
  );
}

function CompassCard({ degrees, speed }: { degrees: number; speed: number; }) {

  const COMPASS_SIZE = '70px';

  const getDirection = (degrees: number) => {
    const oppositeDegrees = (degrees + 180) % 360;

    if (oppositeDegrees >= 337.5 || oppositeDegrees < 22.5) return 'north';
    if (oppositeDegrees >= 22.5 && oppositeDegrees < 67.5) return 'northeast';
    if (oppositeDegrees >= 67.5 && oppositeDegrees < 112.5) return 'east';
    if (oppositeDegrees >= 112.5 && oppositeDegrees < 157.5) return 'southeast';
    if (oppositeDegrees >= 157.5 && oppositeDegrees < 202.5) return 'south';
    if (oppositeDegrees >= 202.5 && oppositeDegrees < 247.5) return 'southwest';
    if (oppositeDegrees >= 247.5 && oppositeDegrees < 292.5) return 'west';
    if (oppositeDegrees >= 292.5 && oppositeDegrees < 337.5) return 'northwest';
    return 'north'; // default case
  };

  const direction = getDirection(degrees);

  return (
    <Card w="100%" h="50%" bgColor='rgba(0, 0, 0, 0.05)' color='white'>

      <CardHeader>
        <Heading size='md'>Wind</Heading>
      </CardHeader>

      <CardBody w="100%">
        <Flex w="100%" flexDir='row' color='rgba(255, 255, 255, 0.7)'>
          <Spacer />
          <Flex flexDir="column">
            <Heading fontSize="md" mt={2}>{direction.charAt(0).toUpperCase() + direction.slice(1)}</Heading>
            <Heading fontSize="md" mt={2}>{speed + "km/h"}</Heading>
          </Flex>
          <Spacer />

          <Circle size={COMPASS_SIZE} borderWidth='2px' borderColor='rgba(255, 255, 255, 0.25)'>
            <Flex h={COMPASS_SIZE} w={COMPASS_SIZE} position='relative' p={1} flexDir='column' alignItems='center' textAlign='center' fontSize={14}>
              <Icon as={MdOutlineArrowRightAlt} boxSize={8} style={{
                color: 'rgba(255, 255, 255, 1)',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%)  rotate(${degrees - 90}deg)` //-90 bcs it initially points to the right ;)
              }} />
              <Center>
                <Heading fontSize='sm'>N</Heading>
              </Center>
              <Spacer />
              <Center w='95%'>
                <Heading fontSize='sm'>W</Heading>
                <Spacer />
                <Heading fontSize='sm'>E</Heading>
              </Center>
              <Spacer />
              <Center>
                <Heading fontSize='sm'>S</Heading>
              </Center>
            </Flex>
          </Circle>

          <Spacer />
        </Flex>
      </CardBody>


    </Card>
  );
}

function Statistics({realTimeData} : {realTimeData: any;}) {

  const real = realTimeData;
  const weatherData = [
    { name: 'Humidity', value: real.humidity, extension: '%' },
    { name: 'Real feel', value: real.temperatureApparent, extension: '°C' },
    { name: 'UV', value: real.uvIndex, extension: '' },
    { name: 'Pressure', value: real.pressureSurfaceLevel, extension: 'mbar' },
    { name: 'Chance of rain', value: real.precipitationProbability, extension: '%' },
  ];

  return (
    <Card w={{base: '100%', sm: '50%'}} textAlign='left' bgColor='rgba(0, 0, 0, 0.05)' color='white'>
          <CardHeader>
            <Heading size='md'>Statistics</Heading>
          </CardHeader>
          <CardBody w="100%">
            <Stack w='100%' divider={<StackDivider />}>
              {
                (() => {
          
                  return weatherData.map((item, index) => (
                    <Flex p="2" flexDir="row" justifyContent="center" alignItems="center" key={index} w='100%'>
                      <Text size="xs">{item.name}</Text>
                      <Spacer />
                      <Heading fontSize="sm">
                        {item.value}{item.extension}
                      </Heading>
                    </Flex>
                  ));
                })()
              }
            </Stack>
          </CardBody>
        </Card>
  )
}

interface RealtimetProps {}

// Creates a specifc block of weatherinformation based on timesteps ('1d', '1h', 'realtime')
// This is a generic Weather Widget. it creates react component instance based on the timestep so there is conditional rendering.
function Realtime({ }: RealtimetProps) {
  const { realTimeData, loading, dailyData } = useWeatherContext();

  useEffect(() => {
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render real-time weather information
  //dailyData.find(() => true picks the first element in array
  return (
    <>
      <Temperature 
      realTimeData={realTimeData?.values ?? {}} 
      tempMin={dailyData.find(() => true)?.values?.temperatureMin ?? 0} 
      tempMax={dailyData.find(() => true)?.values?.temperatureMax ?? 0}
      sunriseTime={dailyData.find(() => true)?.values?.sunriseTime ?? null}
      sunsetTime={dailyData.find(() => true)?.values?.sunsetTime ?? null}
      />

      <Flex w='100%' gap='5' flexDir={{base: 'column', sm: 'row'}}>
        <Flex flexDir='column' w={{base: '100%', sm: '50%'}} gap={3}>
          <CompassCard degrees={realTimeData?.values?.windDirection ?? 0} speed={realTimeData?.values?.windSpeed ?? 0} />
          <Spacer />
          <Sun rise={dailyData.find(() => true)?.values?.sunriseTime ?? "0"} set={dailyData.find(() => true)?.values?.sunsetTime ?? "0"} />
        </Flex>

        <Statistics realTimeData={realTimeData?.values ?? {}} />
      </Flex>
    </>
  );
}

export default Realtime;
