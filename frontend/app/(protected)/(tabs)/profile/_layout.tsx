import React from "react";
import { Stack } from "expo-router";
import useTheme from "@/src/hooks/useTheme";

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
      <Stack.Screen name="Profile" />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="AccountSettings" />
      <Stack.Screen name="PrivacyPolicy" />
      <Stack.Screen name="HelpCenter" />
      <Stack.Screen name="Preferences" />
    </Stack>
  );
}
