import React from "react";
import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(protected)/(tabs)/home"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
