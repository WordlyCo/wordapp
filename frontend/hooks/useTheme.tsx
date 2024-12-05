import { useEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";

// Brand colors and key palette values
const palette = {
  // Purple brand color preserved
  purple: {
    main: "rgb(79, 76, 205)",
    light: "rgb(226, 223, 255)",
    dark: "rgb(54, 49, 180)",
  },
  // Complementary accent color
  coral: {
    main: "#FF6B6B",
    light: "#FFE2E2",
    dark: "#CC4545",
  },
  // Neutral grays
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    800: "#262626",
    900: "#171717",
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    // Core colors - Using brand purple
    primary: palette.purple.main,
    onPrimary: "#FFFFFF",
    primaryContainer: palette.purple.light,
    onPrimaryContainer: "rgb(12, 0, 106)",

    // Secondary colors - Complementary coral
    secondary: palette.coral.main,
    onSecondary: "#FFFFFF",
    secondaryContainer: palette.coral.light,
    onSecondaryContainer: "#2C1B1B",

    // Tertiary colors - Softer purple
    tertiary: palette.purple.main,
    onTertiary: "#FFFFFF",
    tertiaryContainer: palette.purple.light,
    onTertiaryContainer: "rgb(12, 0, 106)",

    // Quaternary colors - Muted coral
    quaternary: palette.coral.main,
    onQuaternary: "#FFFFFF",
    quaternaryContainer: palette.coral.light,
    onQuaternaryContainer: "#2C1B1B",

    // Error states
    error: "#FF9B9B",
    onError: "#FFFFFF",
    errorContainer: "#FFE2E2",
    onErrorContainer: "#8C5F5F",

    // Background and surface
    background: palette.neutral[50],
    onBackground: palette.neutral[900],
    surface: palette.neutral[50],
    onSurface: palette.neutral[900],
    surfaceVariant: palette.neutral[100],
    onSurfaceVariant: palette.neutral[800],

    // Other
    outline: palette.neutral[300],
    outlineVariant: palette.neutral[200],
    shadow: "rgba(0, 0, 0, 0.1)",
    scrim: "rgba(0, 0, 0, 0.3)",
    inverseSurface: palette.neutral[900],
    inverseOnSurface: palette.neutral[50],
    inversePrimary: palette.purple.light,
    progress: "#25A879",

    // Elevation
    elevation: {
      level0: "transparent",
      level1: palette.neutral[50],
      level2: palette.neutral[100],
      level3: palette.neutral[200],
      level4: palette.neutral[200],
      level5: palette.neutral[200],
    },

    // Disabled states
    surfaceDisabled: "rgba(28, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(28, 27, 31, 0.38)",
    backdrop: "rgba(28, 27, 31, 0.4)",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    // Core colors - Using brand purple
    primary: palette.purple.main,
    onPrimary: "#FFFFFF",
    primaryContainer: palette.purple.dark,
    onPrimaryContainer: palette.purple.light,

    // Secondary colors - Complementary coral
    secondary: palette.coral.main,
    onSecondary: "#FFFFFF",
    secondaryContainer: palette.coral.dark,
    onSecondaryContainer: palette.coral.light,

    // Tertiary colors - Softer purple
    tertiary: palette.purple.main,
    onTertiary: "#FFFFFF",
    tertiaryContainer: palette.purple.dark,
    onTertiaryContainer: palette.purple.light,

    // Quaternary colors - Muted coral
    quaternary: palette.coral.main,
    onQuaternary: "#FFFFFF",
    quaternaryContainer: palette.coral.dark,
    onQuaternaryContainer: palette.coral.light,

    // Error states
    error: "#FDA29B",
    onError: "#FFFFFF",
    errorContainer: "#A42941",
    onErrorContainer: "#FFE2E2",

    // Background and surface
    background: palette.neutral[900],
    onBackground: palette.neutral[50],
    surface: palette.neutral[800],
    onSurface: palette.neutral[50],
    surfaceVariant: palette.neutral[800],
    onSurfaceVariant: palette.neutral[100],

    // Other
    outline: palette.neutral[300],
    outlineVariant: palette.neutral[800],
    shadow: "rgba(0, 0, 0, 0.3)",
    scrim: "rgba(0, 0, 0, 0.5)",
    inverseSurface: palette.neutral[50],
    inverseOnSurface: palette.neutral[900],
    inversePrimary: palette.purple.main,
    progress: "#25A879",

    // Elevation
    elevation: {
      level0: "transparent",
      level1: palette.neutral[800],
      level2: palette.neutral[800],
      level3: palette.neutral[800],
      level4: palette.neutral[800],
      level5: palette.neutral[800],
    },

    // Disabled states
    surfaceDisabled: "rgba(229, 225, 230, 0.12)",
    onSurfaceDisabled: "rgba(229, 225, 230, 0.38)",
    backdrop: "rgba(0, 0, 0, 0.4)",
  },
};

const useTheme = () => {
  const [theme, setTheme] = useState(darkTheme);
  const colorScheme = useColorScheme();
  const currTheme = colorScheme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    setTheme(currTheme);
  }, [colorScheme]);

  return {
    theme,
    ...theme,
  };
};

export default useTheme;
