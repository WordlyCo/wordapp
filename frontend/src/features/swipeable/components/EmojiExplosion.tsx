import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";

export const CAP_EMOJIS = [
  "🧢",
  "🤥",
  "🤡",
  "👻",
  "👾",
  "😱",
  "🙄",
  "👎",
  "❌",
  "💔",
  "🤔",
  "😒",
  "🙅",
  "😤",
  "🚫",
  "🔴",
  "⛔",
  "💭",
  "🎭",
  "🔍",
  "📢",
  "📛",
  "🚩",
  "😵",
];

export const LEGIT_EMOJIS = [
  "💯",
  "🔥",
  "👑",
  "🎉",
  "✨",
  "💫",
  "⭐",
  "🌟",
  "👍",
  "💪",
  "🏆",
  "🥇",
  "✅",
  "🟢",
  "💎",
  "🎯",
  "💰",
  "🏅",
  "🔑",
  "💚",
  "🎊",
  "🎖️",
  "👏",
];

interface EmojiParticleProps {
  emoji: string;
  index: number;
  onComplete: () => void;
}

interface EmojiExplosionProps {
  isExploding: boolean;
  emojis: string[];
  count?: number;
  onComplete?: () => void;
}

const EmojiParticle: React.FC<EmojiParticleProps> = ({
  emoji,
  index,
  onComplete,
}) => {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const randomX = (Math.random() * 2 - 1) * 120;
    const randomY = -Math.random() * 150 - 50;
    const startDelay = index * 20;
    const duration = 1000 + Math.random() * 400;

    scale.value = withDelay(
      startDelay,
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.5, { duration: 200, easing: Easing.out(Easing.back(1.5)) })
      )
    );

    translateX.value = withDelay(
      startDelay,
      withTiming(randomX, { duration, easing: Easing.out(Easing.quad) })
    );

    translateY.value = withDelay(
      startDelay,
      withTiming(randomY, { duration, easing: Easing.out(Easing.quad) })
    );

    opacity.value = withDelay(
      startDelay + duration - 300,
      withTiming(
        0,
        { duration: 300, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onComplete)();
          }
        }
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${translateX.value * 0.2}deg` },
      ],
    };
  });

  const size = 10 + Math.random() * 20;

  return (
    <Animated.View style={[styles.particleContainer, animatedStyle]}>
      <Text
        style={[
          styles.emoji,
          {
            fontSize: size,
            textShadowColor: "rgba(0, 0, 0, 0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          },
        ]}
      >
        {emoji}
      </Text>
    </Animated.View>
  );
};

const EmojiExplosion: React.FC<EmojiExplosionProps> = ({
  isExploding,
  emojis,
  count = 15,
  onComplete,
}) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const completedParticles = useRef(0);

  useEffect(() => {
    if (isExploding) {
      console.log("Starting emoji explosion with", count, "particles");
      completedParticles.current = 0;
      generateParticles();
    } else {
      setParticles([]);
    }
  }, [isExploding, count, emojis]);

  const handleParticleComplete = () => {
    completedParticles.current += 1;
    console.log(`Particle completed: ${completedParticles.current}/${count}`);

    if (completedParticles.current >= count && onComplete) {
      onComplete();
    }
  };

  const generateParticles = () => {
    const newParticles = Array.from({ length: count }).map((_, index) => {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      return (
        <EmojiParticle
          key={`particle-${index}`}
          emoji={randomEmoji}
          index={index}
          onComplete={handleParticleComplete}
        />
      );
    });

    setParticles(newParticles);
  };

  if (!isExploding) return null;

  return <View style={styles.container}>{particles}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  particleContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  emoji: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EmojiExplosion;
