import React from "react";
import { Redirect } from "expo-router";
import { useStore } from "../stores/store";

export default function Index() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)" />;
}
