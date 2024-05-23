import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useToast,
  Button,
  Box,
  Flex,
  Kbd,
  Heading,
  useBreakpointValue
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BiMap, BiSearchAlt } from "react-icons/bi";
import { useWeatherContext } from "../WeatherContext";
import { useState, useEffect, useRef } from "react";

interface SearchProps {
  isApiOverloaded: () => boolean;
  validateLocation: (searchInput?: string, latitude?: number, longitude?: number) => Promise<boolean>;
}

export default function Search({ isApiOverloaded, validateLocation }: SearchProps) {
  const { location, loading, lastCalled } = useWeatherContext();
  const [isLocalLoading, setIsLocalLoading] = useState(false); // used for setting to loading feature of button
  const [searchInput, setSearchInput] = useState("Amsterdam, Netherlands");
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const showComponent = useBreakpointValue({base: false, lg: true});
  const showShortcut = useBreakpointValue({base: false, md: true});

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
    if (!validLocation) setSearchInput("");

    setIsLocalLoading(false);
  }

  useEffect(() => {
    setSearchInput(location.address);
  }, [location]);

  //shortcut for selecting the searchbar to start typing
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select(); // Select all text in the input
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {showComponent && <Heading size={'xs'}>
        Last updated:{" "}
        {lastCalled ? new Date(lastCalled).toLocaleTimeString() : "Never"}
      </Heading>}

      <Flex w={{base: '90%', lg: '50%'}} alignItems={'center'}>
        <InputGroup size='lg' >
          <InputLeftElement pointerEvents="none">
            <Icon as={BiMap} boxSize={6} color='blue.600' />
          </InputLeftElement>
          <Input
            ref={inputRef}
            type="text"
            variant="outline"
            placeholder="Search a location"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            colorScheme="blue"
            onKeyDown={(e) => {
              if (e.key === 'Enter') click();
            }}
          />

          {showShortcut && <InputRightElement mr={6}>
            <Kbd fontSize='medium' fontWeight='bold' mx={1}>⌘</Kbd> + <Kbd fontSize='medium' fontWeight='bold' mx={1}>K</Kbd>
          </InputRightElement>}

        </InputGroup>
      </Flex>

      {showComponent && <IconButton
        variant={"outline"}
        borderWidth={2}
        fontSize='22px'
        onClick={() => click()}
        colorScheme="blue"
        aria-label="Search location"
        icon={<BiSearchAlt />}
        isLoading={isLocalLoading}
        isDisabled={loading}
      />}
    </>
  );
}
