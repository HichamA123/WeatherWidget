import { IconButton } from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";
import { useWeatherContext } from "../WeatherContext";
import { useState } from "react";

interface RefreshProps {
    isApiOverloaded: () => boolean;
}

export default function Refresh({ isApiOverloaded }: RefreshProps) {
    const { loading, updateWeatherData, updateLoading } = useWeatherContext();
    const [isLocalLoading, setIsLocalLoading] = useState(false); // used for setting to loading feature of button

    async function click() {
        if (isApiOverloaded()) return;
        updateLoading(true);
        setIsLocalLoading(true);

        try {
            await updateWeatherData();
        } catch (error) {
            // catches any errors from the axios call
            console.error(error);
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
