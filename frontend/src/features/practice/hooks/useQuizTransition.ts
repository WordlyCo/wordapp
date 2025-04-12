import { useRef } from "react";
import { Animated } from "react-native";

const useQuizTransition = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const resetAnimations = () => {
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  };

  const animateOut = (
    callback: () => void,
    config = {
      duration: 200,
      fadeValue: 0,
      slideValue: -20,
    }
  ) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: config.fadeValue,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: config.slideValue,
        duration: config.duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      fadeAnim.setValue(1);
      slideAnim.setValue(Math.abs(config.slideValue));
    });
  };

  const animateIn = (config = { duration: 250 }) => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: config.duration,
      useNativeDriver: true,
    }).start();
  };

  const getAnimatedStyle = () => ({
    opacity: fadeAnim,
    transform: [{ translateX: slideAnim }],
  });

  return {
    fadeAnim,
    slideAnim,
    animateOut,
    animateIn,
    getAnimatedStyle,
    resetAnimations,
  };
};

export default useQuizTransition;
