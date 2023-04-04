import "./App.css";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { AllRoutes } from "./routes/allRoutes";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider position="top-right" zIndex={2077}>
          <ModalsProvider>
          <div className="App">
            <AllRoutes />
          </div>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
