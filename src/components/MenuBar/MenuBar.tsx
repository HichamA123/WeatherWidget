import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BiAccessibility } from "react-icons/bi";
import { useWeatherContext } from "../WeatherContext";
import { } from "react";
import { timeoutIsDone, TIMEOUT_MINUTES } from "../../utils";
import { getLocation } from "../../services/locationService";
import Search from "./Search";
import Refresh from "./Refresh";
import MyLocation from "./MyLocation";

export default function MenuBar() {
  const { lastCalled, updateLocation, updateLoading } = useWeatherContext();
  const toast = useToast();

  //checks if location is valid, if so place it in the central context and update weather data
  async function validateLocation(searchInput?: string, latitude?: number, longitude?: number) {

    if (isApiOverloaded()) return false;

    //quick check if atleast 1 param is given
    if (!searchInput && (latitude == undefined || longitude == undefined)) {
      console.error('Either location or both lat and lng must be provided');
      return false;
    }

    try {
      updateLoading(true);

      const promiseResp = getLocation(searchInput, latitude, longitude);

      // toast.promise(resp, {
      //   success: { title: 'Updated Weather', description: 'Looks great' },
      //   error: { title: 'Update Failed', description: 'Something wrong' },
      //   loading: { title: 'Updating weather', description: 'Please wait' },
      // })

      const locations = await promiseResp;

      if (locations && locations.length == 0) {
        //invalid location
        toast({
          title: "Location not found",
          description: "Please try again (for eg. Amsterdam, New York)",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        updateLoading(false);
        return false;
      } else if ((latitude == undefined || longitude == undefined) && locations.length > 1) {
        // received more than 1 locations back
        toast({
          title: `Multiple matches (${locations.length}). Picked best match.`,
          description: "Please specify information",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }

      // from here it is valid location data
      const location = locations[0]; // taking first location option in list
      updateLocation({
        address: location.formatted_address,
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng,
      });

      return true;
    } catch (error) {
      // catches any errors from the axios call or when processing the location data in this function
      console.error(error);
      toast({
        title: "Validating location failed",
        description: "Please contact customer support (hicham)",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      updateLoading(false);

      return false;
    }

  }

  function isApiOverloaded() {
    //safety prevention for hitting the tomorrow.io api limit
    if (lastCalled && !timeoutIsDone(lastCalled)) {
      // TIMEOUT_MINUTES minutes have not passed yet
      const now = Date.now();
      const timePassed = now - lastCalled;
      const remainingTime = TIMEOUT_MINUTES * 60 * 1000 - timePassed;
      const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
      const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      toast({
        title: "Too many requests",
        description: `Please wait ${remainingMinutes} minute(s) and ${remainingSeconds} second(s) before trying again.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return true;
    }

    // if lastcalled is null it means that it never has been called. so it is allowed to call it.
    return false;
  }

  return (
    <Menu>
      <Search isApiOverloaded={isApiOverloaded} validateLocation={validateLocation} />
      <MyLocation isApiOverloaded={isApiOverloaded} validateLocation={validateLocation} />
      <Refresh isApiOverloaded={isApiOverloaded} />
      <MenuButton as={Button} rightIcon={<Icon as={BiAccessibility} />}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  );
}
