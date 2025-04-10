import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "@/src/hooks/useTheme";

export default function AppLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurface,
        tabBarStyle: {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowRadius: 5,
          shadowOpacity: 1,
          height: 60,
          borderTopWidth: 0,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },

        tabBarIcon: ({ color }) => {
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
            <MaterialCommunityIcons name={iconName} size={26} color={color} />
          );
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Store",
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
        }}
      />
      <Tabs.Screen
        name="bank"
        options={{
          title: "Bank",
          headerShown: true,
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <MaterialCommunityIcons
                name="bank"
                size={24}
                color={colors.onSurface}
              />
              <Text style={[styles.headerText, { color: colors.onSurface }]}>
                Word Bank
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
