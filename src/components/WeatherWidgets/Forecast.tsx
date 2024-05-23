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
import { BiSun, BiMoon, BiCloudRain, BiCloudSnow, BiCloud, BiWind, BiLemon } from "react-icons/bi";
import { WeatherData } from "../../services/weatherService";
import { IconType } from "react-icons";


enum ForecastType {
  hourly = "hourly",
  daily = "daily",
}

function ForecastDisplay({ hourly, daily, type }: { hourly: WeatherData[], daily: WeatherData[], type: ForecastType }) {

  if (!hourly && !daily) return (null);

  console.log(daily);

  const weatherIcon = (record: WeatherData): IconType => {
    let cloudCover, windSpeed, rainIntensity, snowIntensity, uvIndex;

    if (type === ForecastType.hourly) {
      ({ cloudCover, windSpeed, rainIntensity, snowIntensity, uvIndex } = record.values);
    } else if (type === ForecastType.daily) {
      cloudCover = record.values.cloudCoverAvg;
      windSpeed = record.values.windSpeedAvg;
      rainIntensity = record.values.rainIntensityAvg;
      snowIntensity = record.values.snowIntensityAvg;
      uvIndex = record.values.uvIndexAvg;
    } else {
      console.error("shouldn't be here");
      return BiLemon;
    }

    const sunriseTime = daily[0].values.sunriseTime;
    const sunsetTime = daily[0].values.sunsetTime;

    const currentTime = new Date(record.time);
    const sunrise = sunriseTime ? new Date(sunriseTime) : null;
    const sunset = sunsetTime ? new Date(sunsetTime) : null;

    const getTimeOnly = (date: Date | null): string | null => {
      return date ? date.toTimeString().split(' ')[0] : null;
    };

    const currentTimeString = getTimeOnly(currentTime);
    const sunriseTimeString = getTimeOnly(sunrise);
    const sunsetTimeString = getTimeOnly(sunset);

    const isDaytime = sunriseTimeString && sunsetTimeString && currentTimeString
      ? (currentTimeString > sunriseTimeString && currentTimeString < sunsetTimeString)
      : true;

    // Determine the weather mood based on the extracted data
    if (rainIntensity && rainIntensity > 5) return BiCloudRain; // mm/hour
    if (!isDaytime) return BiMoon; // Before sunrise or after sunset, return moon icon
    if (snowIntensity && snowIntensity > 1) return BiCloudSnow; // mm/hour
    if (cloudCover && cloudCover > 80) return BiCloud; // %
    if (windSpeed && windSpeed > 25) return BiWind; // m/s
    if (uvIndex && uvIndex > 4) return BiSun; // > 5 = a lot of sun
    return BiSun; // Default to sun icon if no other conditions are met
  };

  //returns date like 23/5 and 25/6
  function getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-indexed month
    return `${day}/${month}`;
  }


  //returns a short label for time or the day of the week
  function getTimeLabel(dateString: string): string {
    const date = new Date(dateString);

    if (type === ForecastType.daily) {
      return date.toLocaleDateString(undefined, { weekday: 'long' });
    } else {
      const now = new Date();
      const dateHour = date.getUTCHours();
      const nowHour = now.getUTCHours();

      if (dateHour === nowHour) {
        return "Now";
      }

      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }


  //returns index based on current hour
  const getCurrentHourIndex = (): number => {
    const currentHour = new Date().getUTCHours();
    return hourly.findIndex(item => new Date(item.time).getUTCHours() === currentHour);
  };

  const slicedData = () => {
    if (type === ForecastType.hourly && hourly) {
      const currentHourIndex = getCurrentHourIndex();
      const slicedHourly = hourly.slice(currentHourIndex, currentHourIndex + 24);
      // return slicedHourly.length === 24 ? slicedHourly : [...slicedHourly, ...hourly.slice(0, 24 - slicedHourly.length)]; // for safety it spreads more if it is not 24 in len
      return slicedHourly;
    } else if (type === ForecastType.daily && daily) {
      return daily.slice(0, 5);
    }
    return [];
  };

  const data = slicedData();

  return (
    <Flex
      overflowX='auto'
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none", /* for Internet Explorer, Edge */
        scrollbarWidth: "none", /* for Firefox */
      }}
    >
      {data.map((item, index) => (
        <Stack w="100%" key={index} mx={3}>
          <Flex p="1" flexDir="column" alignItems="center" w="100%">
            {type === ForecastType.daily ? (
              <>
                <Heading size="md">
                  {Math.round(item.values.temperatureMax ?? 0)}<Text as="sup">&deg;C</Text>
                </Heading>
                <Heading size="md" mt={3}>
                  {Math.round(item.values.temperatureMin ?? 0)}<Text as="sup">&deg;C</Text>
                </Heading>
              </>
            ) : (
              <Heading size="md">
                {Math.round(item.values.temperature ?? 0)}<Text as="sup">&deg;C</Text>
              </Heading>
            )}
            <Icon as={weatherIcon(item)} boxSize={8} my={7} />

            <Text fontSize="xs">
              {Math.round(type === ForecastType.daily ? item.values.windSpeedAvg ?? 0 : item.values.windSpeed ?? 0)} km/h
            </Text>

            <Heading size="sm" mx={2}>{getTimeLabel(item.time)}</Heading>

            {type === ForecastType.daily && (
              <Text fontSize="xs">{getFormattedDate(item.time)}</Text>
            )}
          </Flex>
        </Stack>
      ))}

    </Flex>
  );
}

interface ForecastProps { }

function Forecast({ }: ForecastProps) {
  const { dailyData, hourlyData, loading } = useWeatherContext();

  useEffect(() => {
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card w='100%' bgColor='rgba(0, 0, 0, 0.05)' color='white'>
        <CardHeader>
          <Heading size='md'>24-hour forecast</Heading>
        </CardHeader>
        <CardBody w="100%">
          <ForecastDisplay hourly={hourlyData ?? []} daily={dailyData ?? []} type={ForecastType.hourly} />
        </CardBody>
      </Card>

      <Spacer />

      <Card w='100%' bgColor='rgba(0, 0, 0, 0.05)' color='white'>
        <CardHeader>
          <Heading size='md'>5-day forecast</Heading>
        </CardHeader>
        <CardBody w="100%">
          <ForecastDisplay hourly={hourlyData ?? []} daily={dailyData ?? []} type={ForecastType.daily} />
        </CardBody>
      </Card>
    </>
  );
}

export default Forecast;


