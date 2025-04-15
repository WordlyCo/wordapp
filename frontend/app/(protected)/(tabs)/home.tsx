import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { Text, Button, Surface, ProgressBar } from "react-native-paper";
import { useRouter } from "expo-router";
import useTheme from "@/src/hooks/useTheme";
import { useStore } from "@/src/stores/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { authFetch } from "@/lib/api";

const { width } = Dimensions.get("window");

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "practice",
    title: "Practice",
    icon: "brain",
    route: "/(protected)/practice/quiz",
    color: "primary",
  },
  {
    id: "new-words",
    title: "New Words",
    icon: "plus-circle",
    route: "/(protected)/new-words",
    color: "secondary",
  },
  {
    id: "review",
    title: "Review",
    icon: "refresh",
    route: "/(protected)/review",
    color: "tertiary",
  },
  {
    id: "stats",
    title: "Stats",
    icon: "chart-line",
    route: "/(protected)/stats",
    color: "primaryContainer",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { categories, fetchCategories, isLoading } = useStore();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const navigateTo = (path: string) => {
    try {
      router.push(path as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Progress Section */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={[
            styles.progressCard,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <View style={styles.progressHeader}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.progressTitle, { color: colors.onSurface }]}>
              Today's Progress
            </Text>
          </View>

          <View style={styles.progressContent}>
            <View style={styles.progressItem}>
              <Text
                style={[
                  styles.progressLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Words Learned
              </Text>
              <Text style={[styles.progressValue, { color: colors.onSurface }]}>
                5/10
              </Text>
              <ProgressBar
                progress={0.5}
                color={colors.primary}
                style={styles.progressBar}
              />
            </View>

            <View style={styles.progressItem}>
              <Text
                style={[
                  styles.progressLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Practice Time
              </Text>
              <Text style={[styles.progressValue, { color: colors.onSurface }]}>
                15/30 min
              </Text>
              <ProgressBar
                progress={0.5}
                color={colors.secondary}
                style={styles.progressBar}
              />
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.quickActionsContainer}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInUp.delay(300 + index * 100)
                  .duration(600)
                  .springify()}
              >
                <Surface
                  style={[
                    styles.quickActionCard,
                    {
                      backgroundColor:
                        action.color === "primary"
                          ? colors.primary
                          : action.color === "secondary"
                          ? colors.secondary
                          : action.color === "tertiary"
                          ? colors.tertiary
                          : colors.primaryContainer,
                    },
                  ]}
                  elevation={1}
                >
                  <View style={styles.quickActionWrapper}>
                    <Button
                      mode="contained-tonal"
                      onPress={() => navigateTo(action.route)}
                      style={[
                        styles.quickActionButton,
                        {
                          backgroundColor:
                            action.color === "primary"
                              ? colors.primary
                              : action.color === "secondary"
                              ? colors.secondary
                              : action.color === "tertiary"
                              ? colors.tertiary
                              : colors.primaryContainer,
                        },
                      ]}
                      icon={action.icon}
                      contentStyle={styles.quickActionContent}
                    >
                      {action.title}
                    </Button>
                  </View>
                </Surface>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Learning Insights */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600).springify()}
          style={[
            styles.insightsCard,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <View style={styles.insightsHeader}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={24}
              color={colors.tertiary}
            />
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Learning Insights
            </Text>
          </View>

          <View style={styles.insightsContent}>
            <View style={styles.insightItem}>
              <Text
                style={[
                  styles.insightLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Current Streak
              </Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>
                3 days
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Text
                style={[
                  styles.insightLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Words Mastered
              </Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>
                42
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Text
                style={[
                  styles.insightLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Accuracy
              </Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>
                85%
              </Text>
            </View>
          </View>
        </Animated.View>
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
  progressCard: {
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressContent: {
    gap: 16,
  },
  progressItem: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  quickActionsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
  },
  quickActionWrapper: {
    overflow: "hidden",
    borderRadius: 16,
  },
  quickActionButton: {
    borderRadius: 16,
  },
  quickActionContent: {
    height: 100,
  },
  insightsCard: {
    borderRadius: 16,
    padding: 16,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  insightsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  insightItem: {
    alignItems: "center",
    gap: 4,
  },
  insightLabel: {
    fontSize: 14,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: "600",
  },
});
