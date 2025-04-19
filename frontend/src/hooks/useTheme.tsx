import { useEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { useStore } from "@/src/stores/store";
const palette = {
  purple: {
    main: "rgb(100, 96, 205)",
    light: "rgb(177, 175, 237)",
    dark: "rgb(63, 60, 148)",
  },
  teal: {
    main: "rgb(64, 186, 164)",
    light: "rgb(184, 240, 230)",
    dark: "rgb(38, 134, 115)",
  },
  amber: {
    main: "rgb(255, 177, 66)",
    light: "rgb(255, 224, 130)",
    dark: "rgb(204, 128, 2)",
  },
  coral: {
    main: "rgb(255, 107, 107)",
    light: "rgb(255, 184, 184)",
    dark: "rgb(204, 82, 82)",
  },
  softBlue: {
    main: "rgb(125, 145, 235)",
    light: "rgb(184, 204, 255)",
    dark: "rgb(74, 92, 155)",
  },
  green: {
    main: "rgb(64, 186, 88)",
    light: "rgb(184, 240, 196)",
    dark: "rgb(38, 134, 55)",
  },
  difficulty: {
    beginner: "rgb(76, 175, 80)",
    intermediate: "rgb(255, 152, 0)",
    advanced: "rgb(244, 67, 54)",
    default: "rgb(117, 117, 117)",
  },
  stats: {
    goal: "rgb(76, 175, 80)",
    streak: "rgb(255, 152, 0)",
    time: "rgb(92, 107, 192)",
  },

  neutral: {
    50: "rgb(249, 250, 251)", // almost white
    100: "rgb(243, 244, 246)", // light gray (good for card bg)
    200: "rgb(229, 231, 235)",
    300: "rgb(209, 213, 219)",
    400: "rgb(156, 163, 175)",
    500: "rgb(107, 114, 128)",
    600: "rgb(75,  85,  99)",
    700: "rgb(55,  65,  81)",
    800: "rgb(31,  41,  55)",
    900: "rgb(17,  24,  39)",
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    primary: palette.purple.main,
    onPrimary: "#FFFFFF",
    primaryContainer: palette.purple.light,
    onPrimaryContainer: palette.purple.dark,

    secondary: palette.teal.main,
    onSecondary: "#FFFFFF",
    secondaryContainer: palette.teal.light,
    onSecondaryContainer: palette.teal.dark,

    tertiary: palette.amber.main,
    onTertiary: "#FFFFFF",
    tertiaryContainer: palette.amber.light,
    onTertiaryContainer: palette.amber.dark,

    quaternary: palette.coral.main,
    onQuaternary: "#FFFFFF",
    quaternaryContainer: palette.coral.light,
    onQuaternaryContainer: palette.coral.dark,

    success: palette.green.main,
    error: palette.coral.main,
    warning: palette.amber.main,
    info: palette.softBlue.main,

    onError: "#FFFFFF",
    errorContainer: palette.coral.light,
    onErrorContainer: palette.coral.dark,

    background: palette.neutral[50],
    onBackground: palette.neutral[900],
    surface: palette.neutral[50],
    onSurface: palette.neutral[900],
    surfaceVariant: palette.neutral[100],
    onSurfaceVariant: palette.neutral[800],

    outline: palette.neutral[300],
    outlineVariant: palette.neutral[200],
    shadow: "rgba(0, 0, 0, 0.1)",
    scrim: "rgba(0, 0, 0, 0.3)",
    inverseSurface: palette.neutral[900],
    inverseOnSurface: palette.neutral[50],
    inversePrimary: palette.purple.light,
    progress: palette.green.main,

    elevation: {
      level0: "transparent",
      level1: palette.neutral[50],
      level2: palette.neutral[100],
      level3: palette.neutral[200],
      level4: palette.neutral[200],
      level5: palette.neutral[200],
    },

    surfaceDisabled: "rgba(28, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(28, 27, 31, 0.38)",
    backdrop: "rgba(28, 27, 31, 0.4)",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: palette.purple.main,
    onPrimary: "#FFFFFF",
    primaryContainer: palette.purple.dark,
    onPrimaryContainer: palette.purple.light,

    secondary: palette.teal.main,
    onSecondary: "#FFFFFF",
    secondaryContainer: palette.teal.dark,
    onSecondaryContainer: palette.teal.light,

    tertiary: palette.amber.main,
    onTertiary: "#FFFFFF",
    tertiaryContainer: palette.amber.dark,
    onTertiaryContainer: palette.amber.light,

    quaternary: palette.coral.main,
    onQuaternary: "#FFFFFF",
    quaternaryContainer: palette.coral.dark,
    onQuaternaryContainer: palette.coral.light,

    success: palette.green.main,
    error: palette.coral.main,
    warning: palette.amber.main,
    info: palette.softBlue.main,

    onError: "#FFFFFF",
    errorContainer: palette.coral.dark,
    onErrorContainer: palette.coral.light,

    background: palette.neutral[900],
    onBackground: palette.neutral[50],
    surface: palette.neutral[800],
    onSurface: palette.neutral[50],
    surfaceVariant: palette.neutral[800],
    onSurfaceVariant: palette.neutral[100],

    outline: palette.neutral[400],
    outlineVariant: palette.neutral[700],
    shadow: "rgba(0, 0, 0, 0.3)",
    scrim: "rgba(0, 0, 0, 0.5)",
    inverseSurface: palette.neutral[50],
    inverseOnSurface: palette.neutral[900],
    inversePrimary: palette.purple.main,
    progress: palette.green.main,

    elevation: {
      level0: "transparent",
      level1: palette.neutral[800],
      level2: "rgb(43, 43, 43)",
      level3: "rgb(48, 48, 48)",
      level4: "rgb(53, 53, 53)",
      level5: "rgb(58, 58, 58)",
    },

    surfaceDisabled: "rgba(229, 225, 230, 0.12)",
    onSurfaceDisabled: "rgba(229, 225, 230, 0.38)",
    backdrop: "rgba(0, 0, 0, 0.4)",
  },
};

export type ColorType = typeof lightTheme.colors &
  typeof darkTheme.colors &
  WordBirdColors;

type WordBirdColors = {
  streak: string;
  streakContainer: string;
  goal: string;
  goalContainer: string;
  timer: string;
  timerContainer: string;
  categories: {
    books: string;
    movies: string;
    philosophy: string;
    science: string;
    technology: string;
    music: string;
  };
  difficulty: {
    beginner: string;
    intermediate: string;
    advanced: string;
    default: string;
  };
};

const lightExtendedColors: WordBirdColors = {
  streak: palette.stats.streak,
  streakContainer: palette.amber.light,
  goal: palette.stats.goal,
  goalContainer: palette.green.light,
  timer: palette.stats.time,
  timerContainer: palette.softBlue.light,
  categories: {
    books: palette.purple.main,
    movies: palette.softBlue.main,
    philosophy: palette.teal.main,
    science: palette.amber.main,
    technology: palette.coral.main,
    music: palette.green.main,
  },
  difficulty: {
    beginner: palette.difficulty.beginner,
    intermediate: palette.difficulty.intermediate,
    advanced: palette.difficulty.advanced,
    default: palette.difficulty.default,
  },
};

const darkExtendedColors: WordBirdColors = {
  streak: palette.stats.streak,
  streakContainer: palette.amber.dark,
  goal: palette.stats.goal,
  goalContainer: palette.green.dark,
  timer: palette.stats.time,
  timerContainer: palette.softBlue.dark,
  categories: {
    books: palette.purple.main,
    movies: palette.softBlue.main,
    philosophy: palette.teal.main,
    science: palette.amber.main,
    technology: palette.coral.main,
    music: palette.green.main,
  },
  difficulty: {
    beginner: palette.difficulty.beginner,
    intermediate: palette.difficulty.intermediate,
    advanced: palette.difficulty.advanced,
    default: palette.difficulty.default,
  },
};

const extendedLightTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    ...lightExtendedColors,
  },
};

const extendedDarkTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    ...darkExtendedColors,
  },
};

const useTheme = () => {
  const user = useStore((state) => state.user);
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === "light" ? extendedLightTheme : extendedDarkTheme
  );
  console.log("user", user);
  useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(
        user.preferences.theme === "light"
          ? extendedLightTheme
          : extendedDarkTheme
      );
    } else {
      setTheme(
        colorScheme === "light" ? extendedLightTheme : extendedDarkTheme
      );
    }
  }, [colorScheme, user]);

  return {
    theme,
    ...theme,
  };
};

export default useTheme;
