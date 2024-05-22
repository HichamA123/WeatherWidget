import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BiMap, BiSearchAlt } from "react-icons/bi";
import { useWeatherContext } from "../WeatherContext";
import { useState, useEffect } from "react";

interface SearchProps {
  isApiOverloaded: () => boolean;
  validateLocation: (searchInput?: string, latitude?: number, longitude?: number) => Promise<boolean>;
}

export default function Search({ isApiOverloaded, validateLocation }: SearchProps) {
  const { location, loading, lastCalled } = useWeatherContext();
  const [isLocalLoading, setIsLocalLoading] = useState(false); // used for setting to loading feature of button
  const [searchInput, setSearchInput] = useState("Amsterdam, Netherlands");
  const toast = useToast();

  async function click() {
    if (searchInput == '' || searchInput == null) {
      toast({
        title: `No location specified`,
        description: "Please type in a location (for eg. Amsterdam, New York)",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    if (isApiOverloaded()) return;

    setIsLocalLoading(true);

    const validLocation = await validateLocation(searchInput);
    if (validLocation) setSearchInput(location.address);
    else setSearchInput("");

    setIsLocalLoading(false);
  }

  useEffect(() => {
    setSearchInput(location.address);
  }, [location]);

  return (
    <>
      <p>
        Last updated:{" "}
        {lastCalled ? new Date(lastCalled).toLocaleTimeString() : "Never"}
      </p>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={BiMap} color="gray.300" boxSize={5} />
        </InputLeftElement>
        <Input
          type="text"
          variant="outline"
          placeholder="Search a location"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <InputRightElement>
          <IconButton
            variant={"outline"}
            borderWidth={2}
            onClick={() => click()}
            colorScheme="blue"
            aria-label="Search location"
            icon={<BiSearchAlt />}
            isLoading={isLocalLoading}
            isDisabled={loading}
          />
        </InputRightElement>
      </InputGroup>
    </>
  );
}
