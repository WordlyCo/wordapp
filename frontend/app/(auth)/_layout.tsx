import React from "react";
import { Stack } from "expo-router";
import { useStore } from "../../stores/store";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
