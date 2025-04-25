import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

export const usePulsate = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, []);

  return useAnimatedStyle(() => ({
    opacity: 0.2 + progress.value * 1.0,
  }));
};
