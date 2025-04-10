import React from "react";
import { Stack } from "expo-router";
import useTheme from "@/src/hooks/useTheme";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.onSurface,
        },
        headerLargeTitleStyle: {
          color: colors.onSurface,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen
        name="Profile"
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: {
            color: colors.onPrimary,
          },
        }}
      />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="AccountSettings" />
      <Stack.Screen name="PrivacyPolicy" />
      <Stack.Screen name="HelpCenter" />
      <Stack.Screen name="Preferences" />
    </Stack>
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
