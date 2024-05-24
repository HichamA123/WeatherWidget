import { } from "react";
import "./App.css";
import WeatherDashboard from "./components/WeatherDashboard";
import { WeatherProvider } from "./components/WeatherContext";
import MenuBar from "./components/MenuBar/MenuBar";
import {
  Flex,
} from "@chakra-ui/react";


function App() {

  return (
    <WeatherProvider>
      <Flex w='100vw' minH='100vh' flexDirection='column' alignItems='center'>
        <MenuBar/>
        <WeatherDashboard />
      </Flex>
    </WeatherProvider>
  );
}

export default App;
