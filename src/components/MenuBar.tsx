import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BiAccessibility, BiMap, BiSearchAlt } from "react-icons/bi";
import { useWeatherContext } from "./WeatherContext";
import { useEffect, useState } from "react";
import { validVariable, minMinutesPast } from "../utils";
import { getLocation } from "../services/locationService";

//TODO
//toast for reload and enter on search of location
//toast for pressing on location to fetch current location (save in cookies)
//modal on limit reached or problem with fetching data. or no internet. also

export default function MenuBar() {
  const { updateLocation, updateWeatherData, lastCalled } = useWeatherContext();
  const [searchLocation, setSearchLocation] = useState("Amsterdam, Netherlands");
  const [isSearching, setIsSearching] = useState(false);
  const toast = useToast();

  async function search() {
    
    if(lastCalled && !minMinutesPast(lastCalled, 3)) { // 3 minutes have not passed yet
      const now = Date.now();
      const timePassed = now - lastCalled;
      const remainingTime = 3 * 60 * 1000 - timePassed;
      const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
      const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      toast({
        title: "Too many requests",
        description: `Please wait ${remainingMinutes} minute(s) and ${remainingSeconds} second(s) before trying again.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    setIsSearching(true);

    const promiseResp = getLocation(searchLocation);

    // toast.promise(resp, {
    //   success: { title: 'Updated Weather', description: 'Looks great' },
    //   error: { title: 'Update Failed', description: 'Something wrong' },
    //   loading: { title: 'Updating weather', description: 'Please wait' },
    // })

    try {
      const locations = await promiseResp;

      if (locations && locations.length == 0) {
        //invalid location
        toast({
          title: "Invalid location",
          description: "Please try again (for eg. Amsterdam, New York)",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        setSearchLocation("");
        return;
      } else if (locations.length > 1) {
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

      setSearchLocation(location.formatted_address);
      updateWeatherData();

    } catch (error) { // catches any errors from the axios call or when processing the location data in this function
      console.error(error);

      toast({
        title: "Validating location failed",
        description: "Please contact customer support (hicham)",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setSearchLocation("");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <Menu>
      <p>Last updated: {lastCalled ? new Date(lastCalled).toLocaleTimeString() : "Never"}</p>
      <MenuButton as={Button} rightIcon={<Icon as={BiAccessibility} />}>
        Actions
      </MenuButton>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={BiMap} color="gray.300" boxSize={5} />
        </InputLeftElement>
        <Input
          type="text"
          variant="outline"
          placeholder="Search a location"
          onChange={(e) => setSearchLocation(e.target.value)}
          value={searchLocation}
        />
        <InputRightElement>
          <IconButton
            variant={"outline"}
            borderWidth={2}
            onClick={search}
            colorScheme="blue"
            aria-label="Search location"
            icon={<BiSearchAlt />}
            isLoading={isSearching}
          />
        </InputRightElement>
      </InputGroup>
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
