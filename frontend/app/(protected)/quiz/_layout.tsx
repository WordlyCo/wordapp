import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useStore } from "@/src/stores/store";
import useTheme from "@/src/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PracticeLayout() {
  const { colors } = useTheme();
  const quizStats = useStore((state) => state.quizStats);
  const setQuizStats = useStore((state) => state.setQuizStats);
  const fetchDailyQuiz = useStore((state) => state.fetchDailyQuiz);

  useEffect(() => {
    const fetchQuiz = async () => {
      await fetchDailyQuiz();
      console.log("RAN THIS THING");
    };
    fetchQuiz();
    setQuizStats({ ...quizStats, startTime: Date.now() });
  }, []);

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          presentation: "card",
          animationDuration: 300,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </SafeAreaView>
  );
}

 