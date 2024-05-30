import { useEffect } from "react";
import { useWeatherContext } from "../WeatherContext";
import {
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Spacer,
  Text,
  Icon,
} from "@chakra-ui/react";
import { WeatherData } from "../../services/weatherService";
import { weatherIcon } from "../../utils";


export enum ForecastType {
  hourly = "hourly",
  daily = "daily",
  realtime = "realtime"
}

//a scrollable display for the forecasts
function ForecastDisplay({ hourly, daily, type }: { hourly: WeatherData[], daily: WeatherData[], type: ForecastType }) {

  if (!hourly && !daily) return (null);

  //returns date like 23/5 and 25/6
  function getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-indexed month
    return `${day}/${month}`;
  }


  //returns a short label for time or the day of the week if day-forecast 'monday' 'tuesday' if hourly-forecast '04:00' '05:00'
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


  //returns index based on current hour (so the list starts from current hour instead of a random hour)
  const getCurrentHourIndex = (): number => {
    const currentHour = new Date().getUTCHours();
    return hourly.findIndex(item => new Date(item.time).getUTCHours() === currentHour);
  };

  // slices so the daya is 5 days when day forecast else if it is a 24 hour forecast then it will give back max 24 hours in array
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

  //data is now set to the data according to the initialized type of this component
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
            <Icon as={weatherIcon(item, type, daily[0].values.sunriseTime?? null, daily[0].values.sunsetTime ?? null)} boxSize={8} my={7} />

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

  // this needs to be beautified/styled ;)
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


