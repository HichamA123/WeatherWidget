import {
    IconButton,
    useToast,
} from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";
import { useWeatherContext } from "../WeatherContext";
import { useState } from "react";

interface RefreshProps {
    isApiOverloaded: () => boolean;
}

export default function Refresh({ isApiOverloaded }: RefreshProps) {
    const { location, loading, updateWeatherData, updateLoading } = useWeatherContext();
    const [isLocalLoading, setIsLocalLoading] = useState(false); // used for setting to loading feature of button
    const toast = useToast();

    async function click() {
        if (isApiOverloaded()) return;
        updateLoading(true);
        setIsLocalLoading(true);

        try {
            await updateWeatherData();
            toast({
                title: "Updated weather data",
                description: `Location: ${location.address}`,
                status: "success",
                duration: 5000,
                isClosable: true,
              });
        } catch (error) {
            // catches any errors from the axios call
            console.error(error);
            toast({
                title: "Updating weather data failed",
                description: "Please contact customer support (hicham)",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
        } finally {
            updateLoading(false);
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
                aria-label="Refresh weather data"
                icon={<BiRefresh />}
                isLoading={isLocalLoading}
                isDisabled={loading}
            />
        </>
    );
}
