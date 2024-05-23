import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
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
      <Flex w='100vw' flexDirection='column' alignItems='center'>
        <MenuBar/>
        <WeatherDashboard />
      </Flex>

      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={meth}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </WeatherProvider>
  );
}

export default App;
