import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import useTheme from "./hooks/useTheme";
import AppTabs from "./navigation/AppTabs";
import AuthScreen from "./screens/AuthScreen";
import { useStore } from "./stores/store";

const App = () => {
  const { theme } = useTheme();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuthenticated ? <AppTabs /> : <AuthScreen />}
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
