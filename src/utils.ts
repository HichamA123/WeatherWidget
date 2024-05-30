import { IconType } from "react-icons";
import { ForecastType } from "./components/WeatherWidgets/Forecast";
import { BiSun, BiMoon, BiCloudRain, BiCloudSnow, BiCloud, BiWind, BiLemon } from "react-icons/bi";

export function validVariable(variable : any): boolean {
  if (variable == undefined || variable == null) {
    //Non-strict check (==) to allow type coercion. so '3' and 3 would be seen as the same. it checks value only.
    console.error("Variable is invalid. Value: ", variable);
    return false;
  } else {
    return true;
  }
}

export const TIMEOUT_MINUTES: number = 3;

export function timeoutIsDone(lastCalled : number, minutes : number = TIMEOUT_MINUTES): boolean {
  const now = Date.now();
  if (lastCalled == null || now - lastCalled >= minutes * 60 * 1000) { // if timedifference is bigger than the minimum past minutes
    return true;
  }
  console.log(`${minutes} minutes have not passed.`);
  return false;
}


export function weatherIcon(record: any, type: ForecastType, sunriseTime?: string | null, sunsetTime?: string| null): IconType {
  let cloudCover, windSpeed, rainIntensity, snowIntensity, uvIndex;

  if (type === ForecastType.hourly) {
    ({ cloudCover, windSpeed, rainIntensity, snowIntensity, uvIndex } = record.values);
  } else if (type === ForecastType.realtime) {
    ({ cloudCover, windSpeed, rainIntensity, snowIntensity, uvIndex } = record);
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