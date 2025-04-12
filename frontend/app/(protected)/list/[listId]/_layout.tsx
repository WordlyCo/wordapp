import React from "react";
import { Stack } from "expo-router";

export default function ListLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
