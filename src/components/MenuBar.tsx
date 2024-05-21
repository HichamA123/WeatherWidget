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
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BiAccessibility } from "react-icons/bi";
import { useWeatherContext } from "./WeatherContext";
import { useEffect } from "react";
import { validVariable } from "../utils";

//TODO
//toast for reload and enter on search of location
//toast for pressing on location to fetch current location (save in cookies)
//modal on limit reached or problem with fetching data. or no internet. also


export default function MenuBar() {
  // const {dailyData, hourlyData, realTimeData, location, loading } = useWeatherContext();


  return (
    <Menu>
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
