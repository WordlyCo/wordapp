import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  isNew?: boolean;
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
  isDarkMode: boolean;
  isLoading: boolean;
  pulsate?: any;
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
    id: "legit",
    title: "Cap or No Cap?",
    icon: "scale-balance",
    route: "/(protected)/legit",
    isNew: true,
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

const QuickActions: React.FC<QuickActionsProps> = ({
  isDarkMode,
  isLoading,
  pulsate,
}) => {
  const { colors } = useAppTheme();
  const router = useRouter();

  const navigateTo = (path: string) => {
    try {
      router.push(path as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  if (isLoading) {
    return <QuickActionsSkeleton pulsate={pulsate} />;
  }

  return (
    <View style={styles.quickActionsContainer}>
      <Animated.View>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <View key={action.id}>
              <Animated.View>
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
                    {action.isNew && (
                      <View style={styles.newBadgeContainer}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
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
                        icon={
                          action.id === "legit"
                            ? () => <Text style={{ fontSize: 20 }}>🧢</Text>
                            : action.icon
                        }
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

const QuickActionsSkeleton: React.FC<{ pulsate?: any }> = ({ pulsate }) => {
  const { colors } = useAppTheme();

  return (
    <Animated.View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
        Quick Actions
      </Text>
      <View style={styles.quickActionsGrid}>
        {[...Array(4)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.quickActionCard,
              {
                backgroundColor: colors.surfaceVariant,
                width: "48%",
                height: 100,
              },
              pulsate,
            ]}
          />
        ))}
      </View>
    </Animated.View>
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
  newBadgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
    zIndex: 10,
  },
  newBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default QuickActions;
