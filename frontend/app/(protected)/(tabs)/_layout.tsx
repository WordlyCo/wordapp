import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

export default function AppLayout() {
  const { colors, dark } = useAppTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["left", "right", "bottom"]}
    >
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 0.2,
            borderTopColor: colors.outline,
            height: 55,
            paddingBottom: 6,
            elevation: 0,
            shadowColor:
              Platform.OS === "ios" ? "rgba(0,0,0,0.1)" : "transparent",
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 4,
            shadowOpacity: Platform.OS === "ios" ? 0.2 : 0,
          },
          tabBarItemStyle: {
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontWeight: "600",
            fontSize: 12,
            paddingBottom: 4,
          },
          tabBarButton: (props) => {
            const { onPress, ...rest } = props;
            return (
              <View
                {...rest}
                onTouchEnd={(event) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onPress?.(event);
                }}
              />
            );
          },
          tabBarIcon: ({ color, focused }) => {
            let iconName: any;

            switch (route.name) {
              case "home":
                iconName = "home";
                break;
              case "store":
                iconName = "book";
                break;
              case "progress":
                iconName = "chart-line-stacked";
                break;
              case "bank":
                iconName = "bank";
                break;
              case "profile":
                iconName = "account";
                break;
              default:
                iconName = "help";
            }

            return (
              <View style={focused ? styles.activeIconContainer : {}}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={26}
                  color={color}
                />
              </View>
            );
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: true,
            headerTitle: () => (
              <Animated.View
                entering={FadeInDown.duration(600).springify()}
                style={styles.headerContainer}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.headerIconContainer}>
                    <MaterialCommunityIcons
                      name="home"
                      size={24}
                      color={dark ? colors.onSurface : colors.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.headerText,
                      { color: dark ? colors.onSurface : colors.primary },
                    ]}
                  >
                    Home
                  </Text>
                </View>
              </Animated.View>
            ),
            headerStyle: {
              backgroundColor: colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              height: Platform.OS === "ios" ? 120 : 100,
            },
            headerTitleAlign: "left",
            headerShadowVisible: false,
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            title: "Store",
            headerShown: true,
            headerTitle: () => (
              <Animated.View
                entering={FadeInDown.duration(600).springify()}
                style={styles.headerContainer}
              >
                <View style={styles.headerIconContainer}>
                  <MaterialCommunityIcons
                    name="book"
                    size={24}
                    color={dark ? colors.onSurface : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.headerText,
                    { color: dark ? colors.onSurface : colors.primary },
                  ]}
                >
                  Word Store
                </Text>
              </Animated.View>
            ),
            headerStyle: {
              backgroundColor: colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              height: Platform.OS === "ios" ? 120 : 100,
            },
            headerTitleAlign: "left",
            headerShadowVisible: false,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            headerShown: true,
            headerTitle: () => (
              <Animated.View
                entering={FadeInDown.duration(600).springify()}
                style={styles.headerContainer}
              >
                <View style={styles.headerIconContainer}>
                  <MaterialCommunityIcons
                    name="chart-line-stacked"
                    size={24}
                    color={dark ? colors.onSurface : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.headerText,
                    { color: dark ? colors.onSurface : colors.primary },
                  ]}
                >
                  Progress
                </Text>
              </Animated.View>
            ),
            headerStyle: {
              backgroundColor: colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              height: Platform.OS === "ios" ? 120 : 100,
            },
            headerTitleAlign: "left",
            headerShadowVisible: false,
          }}
        />
        <Tabs.Screen
          name="bank"
          options={{
            title: "Bank",
            headerShown: true,
            headerTitle: () => (
              <Animated.View
                entering={FadeInDown.duration(600).springify()}
                style={styles.headerContainer}
              >
                <View style={styles.headerIconContainer}>
                  <MaterialCommunityIcons
                    name="bank"
                    size={24}
                    color={dark ? colors.onSurface : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.headerText,
                    { color: dark ? colors.onSurface : colors.primary },
                  ]}
                >
                  Word Bank
                </Text>
              </Animated.View>
            ),
            headerStyle: {
              backgroundColor: colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              height: Platform.OS === "ios" ? 120 : 100,
            },
            headerTitleAlign: "left",
            headerShadowVisible: false,
          }}
        />
        <Tabs.Screen name="profile" />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 10 : 0,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  activeIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
