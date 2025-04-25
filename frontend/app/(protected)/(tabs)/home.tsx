import React, { useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useAppTheme } from "@/src/contexts/ThemeContext";
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
import { usePulsate } from "@/src/hooks/usePulsate";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const scrollY = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const userStats = useStore((state) => state.user?.userStats);
  const fetchUser = useStore((state) => state.getMe);
  const isFetchingUser = useStore((state) => state.isFetchingUser);

  const pulsate = usePulsate();

  useEffect(() => {
    fetchUser();
  }, []);

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
          streak={userStats?.streak ?? 0}
          wordsMastered={userStats?.learningInsights.wordsMastered ?? 0}
          accuracy={userStats?.learningInsights.accuracy ?? 0}
          diamonds={userStats?.diamonds ?? 0}
          isLoading={isFetchingUser}
          pulsate={pulsate}
        />
        <DailyProgress
          wordsLearned={userStats?.dailyProgress.wordsPracticed ?? 0}
          totalWordsGoal={userStats?.dailyProgress.dailyWordGoal ?? 0}
          practiceTime={userStats?.dailyProgress.practiceTime ?? 0}
          practiceTimeGoal={userStats?.dailyProgress.dailyPracticeTimeGoal ?? 0}
          isLoading={isFetchingUser}
          pulsate={pulsate}
        />
        <QuickActions
          isDarkMode={isDarkMode}
          isLoading={isFetchingUser}
          pulsate={pulsate}
        />
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
