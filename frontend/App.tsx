import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

// TODO: clean up the colors definitions, move into styles
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    "primary": "rgb(79, 76, 205)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(226, 223, 255)",
    "onPrimaryContainer": "rgb(12, 0, 106)",
    "secondary": "rgb(0, 104, 116)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(151, 240, 255)",
    "onSecondaryContainer": "rgb(0, 31, 36)",
    "tertiary": "rgb(0, 104, 116)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(151, 240, 255)",
    "onTertiaryContainer": "rgb(0, 31, 36)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(28, 27, 31)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(28, 27, 31)",
    "surfaceVariant": "rgb(228, 225, 236)",
    "onSurfaceVariant": "rgb(71, 70, 79)",
    "outline": "rgb(120, 118, 128)",
    "outlineVariant": "rgb(200, 197, 208)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(49, 48, 52)",
    "inverseOnSurface": "rgb(243, 239, 244)",
    "inversePrimary": "rgb(194, 193, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(246, 242, 253)",
      "level2": "rgb(241, 237, 251)",
      "level3": "rgb(236, 232, 250)",
      "level4": "rgb(234, 230, 249)",
      "level5": "rgb(230, 227, 248)"
    },
    "surfaceDisabled": "rgba(28, 27, 31, 0.12)",
    "onSurfaceDisabled": "rgba(28, 27, 31, 0.38)",
    "backdrop": "rgba(48, 47, 56, 0.4)",
    "quaternary": "rgb(0, 104, 116)",
    "onQuaternary": "rgb(255, 255, 255)",
    "quaternaryContainer": "rgb(151, 240, 255)",
    "onQuaternaryContainer": "rgb(0, 31, 36)"
  }
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    "primary": "#282828",
    "onPrimary": "#FFFFFF",
    "primaryContainer": "rgb(54, 49, 180)",
    "onPrimaryContainer": "rgb(226, 223, 255)",
    "secondary": "#EC5E62",
    "onSecondary": "rgb(0, 54, 61)",
    "secondaryContainer": "rgb(0, 79, 88)",
    "onSecondaryContainer": "rgb(151, 240, 255)",
    "tertiary": "rgb(79, 216, 235)",
    "onTertiary": "rgb(0, 54, 61)",
    "tertiaryContainer": "rgb(0, 79, 88)",
    "onTertiaryContainer": "rgb(151, 240, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "#161616",
    "onBackground": "rgb(229, 225, 230)",
    "surface": "rgb(28, 27, 31)",
    "onSurface": "rgb(229, 225, 230)",
    "surfaceVariant": "rgb(71, 70, 79)",
    "onSurfaceVariant": "rgb(200, 197, 208)",
    "outline": "rgb(145, 143, 154)",
    "outlineVariant": "rgb(71, 70, 79)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(229, 225, 230)",
    "inverseOnSurface": "rgb(49, 48, 52)",
    "inversePrimary": "rgb(79, 76, 205)",
    "elevation": {
      "level0": "transparent",
      "level1": "#282828",
      "level2": "#5856D6",
      "level3": "rgb(46, 45, 56)",
      "level4": "rgb(48, 47, 58)",
      "level5": "rgb(51, 50, 62)"
    },
    "surfaceDisabled": "rgba(229, 225, 230, 0.12)",
    "onSurfaceDisabled": "rgba(229, 225, 230, 0.38)",
    "backdrop": "rgba(48, 48, 56, 0.4)",
    "quaternary": "rgb(79, 216, 235)",
    "onQuaternary": "rgb(0, 54, 61)",
    "quaternaryContainer": "rgb(0, 79, 88)",
    "onQuaternaryContainer": "rgb(151, 240, 255)"
  }
};

const App = () => {
  const colorScheme = useColorScheme();
  return (
      <AuthProvider>
        <PaperProvider theme={colorScheme == "light" ? lightTheme : darkTheme}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.primary}}>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
  );
};

export default App;
