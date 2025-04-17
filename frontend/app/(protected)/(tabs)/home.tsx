import React, { useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import useTheme from "@/src/hooks/useTheme";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  QuickActions,
  DailyProgress,
  LearningInsights,
} from "@/src/features/home/components";
import { useStore } from "@/src/stores/store";

export default function HomeScreen() {
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const userStats = useStore((state) => state.userStats);
  const fetchUserStats = useStore((state) => state.fetchUserStats);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <LearningInsights
          colors={colors}
          streak={userStats.streak}
          wordsMastered={userStats.learningInsights.wordsMastered}
          accuracy={userStats.learningInsights.accuracy}
          diamonds={userStats.diamonds}
        />
        <DailyProgress
          colors={colors}
          wordsLearned={userStats.dailyProgress.wordsPracticed}
          totalWordsGoal={userStats.dailyProgress.totalWordsGoal}
          practiceTime={userStats.dailyProgress.practiceTime}
          practiceTimeGoal={userStats.dailyProgress.practiceTimeGoal}
        />
        <QuickActions colors={colors} isDarkMode={isDarkMode} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    padding: 16,
    gap: 16,
  },
});
