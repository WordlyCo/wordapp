import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AnimatedActionButtonProps {
  onPress: () => void;
  gradientColors: [string, string];
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  icon?: React.ReactNode;
  isRight?: boolean;
}

const AnimatedActionButton = ({
  onPress,
  icon,
  gradientColors,
  iconName,
  label,
  isRight = false,
}: AnimatedActionButtonProps) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    scale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withTiming(1.1, { duration: 150 }),
      withTiming(1, { duration: 100 })
    );

    rotation.value = withSequence(
      withTiming(isRight ? 15 : -15, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.animatedButtonContainer, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.buttonPressable}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name={iconName} size={32} color="white" />
            {icon}
            <Text style={styles.buttonLabel}>{label}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedActionButton;

const styles = StyleSheet.create({
  animatedButtonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 20,
  },
  buttonPressable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientButton: {
    height: 80,
    width: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 14,
  },
  actionIconButton: {
    marginHorizontal: 10,
  },
});
