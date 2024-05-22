import {
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { BiMap } from "react-icons/bi";
import { useWeatherContext } from "../WeatherContext";
import { useState } from "react";

interface MyLocationProps {
  isApiOverloaded: () => boolean;
  validateLocation: (searchInput?: string, latitude?: number, longitude?: number) => Promise<boolean>;
}

export default function MyLocation({ isApiOverloaded, validateLocation }: MyLocationProps) {
  const { loading } = useWeatherContext();
  const [isLocalLoading, setIsLocalLoading] = useState(false); // used for setting to loading feature of button
  const toast = useToast();

  // Fetch current location using browser location services and set it in the search input
  // Then call search to validate location and update weather data
  async function click() {
    if (isApiOverloaded()) return;
    setIsLocalLoading(true);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await validateLocation(undefined, latitude, longitude); // to validate and update weather data
            setIsLocalLoading(false);
          },
          (error) => {
            console.error(error);
            toast({
              title: "Error fetching location",
              description: "Unable to retrieve your location.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            setIsLocalLoading(false);
          }
        );
      } else {
        toast({
          title: "Geolocation not supported",
          description: "Your browser does not support geolocation.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLocalLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLocalLoading(false);
    }
  }

  return (
    <>
      <IconButton
        variant="outline"
        borderWidth={2}
        onClick={click}
        colorScheme="blue"
        aria-label="My Location"
        icon={<BiMap />}
        isLoading={isLocalLoading}
        isDisabled={loading}
      />
    </>
  );
}
