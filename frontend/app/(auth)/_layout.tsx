import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useStore } from "@/src/stores/store";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  const hasOnboarded = useStore((state) => state.hasOnboarded);

  if (isSignedIn && hasOnboarded) {
    return <Redirect href={"/(protected)/(tabs)/home"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
