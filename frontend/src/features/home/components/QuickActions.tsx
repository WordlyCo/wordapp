import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  lightColor: {
    background: string;
    text: string;
  };
  darkColor: {
    background: string;
    text: string;
  };
}

interface QuickActionsProps {
  colors: any;
  isDarkMode: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "practice",
    title: "Practice",
    icon: "brain",
    route: "/(protected)/quiz",
    lightColor: {
      background: "#6366f1",
      text: "#ffffff",
    },
    darkColor: {
      background: "#818cf8",
      text: "#ffffff",
    },
  },
  {
    id: "new-words",
    title: "New Words",
    icon: "plus-circle",
    route: "/(protected)/(tabs)/store",
    lightColor: {
      background: "#10b981",
      text: "#ffffff",
    },
    darkColor: {
      background: "#34d399",
      text: "#ffffff",
    },
  },
  {
    id: "review",
    title: "Review",
    icon: "refresh",
    route: "/(protected)/review",
    lightColor: {
      background: "#f59e0b",
      text: "#ffffff",
    },
    darkColor: {
      background: "#fbbf24",
      text: "#ffffff",
    },
  },
  {
    id: "stats",
    title: "Stats",
    icon: "chart-line",
    route: "/(protected)/(tabs)/progress",
    lightColor: {
      background: "#ec4899",
      text: "#ffffff",
    },
    darkColor: {
      background: "#f472b6",
      text: "#ffffff",
    },
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    try {
      router.push(path as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View style={styles.quickActionsContainer}>
      <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <View key={action.id}>
              <Animated.View
                entering={FadeInUp.delay(300 + index * 100)
                  .duration(600)
                  .springify()}
              >
                <View style={styles.quickActionWrapperOuter}>
                  <Surface
                    style={[
                      styles.quickActionCard,
                      {
                        backgroundColor: isDarkMode
                          ? action.darkColor.background
                          : action.lightColor.background,
                        elevation: 4,
                        shadowColor: isDarkMode
                          ? "rgba(0,0,0,0.5)"
                          : "rgba(0,0,0,0.2)",
                      },
                    ]}
                    elevation={2}
                  >
                    <View style={styles.quickActionWrapper}>
                      <Button
                        mode="contained"
                        onPress={() => navigateTo(action.route)}
                        style={[
                          styles.quickActionButton,
                          {
                            backgroundColor: "transparent",
                          },
                        ]}
                        icon={action.icon}
                        contentStyle={styles.quickActionContent}
                        labelStyle={[
                          styles.quickActionLabel,
                          {
                            color: isDarkMode
                              ? action.darkColor.text
                              : action.lightColor.text,
                          },
                        ]}
                      >
                        {action.title}
                      </Button>
                    </View>
                  </Surface>
                </View>
              </Animated.View>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionsContainer: {
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
  },
  quickActionWrapperOuter: {
    borderRadius: 16,
    overflow: "hidden",
  },
  quickActionWrapper: {
    borderRadius: 16,
  },
  quickActionButton: {
    borderRadius: 16,
    elevation: 0,
  },
  quickActionContent: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
});

export default QuickActions;
