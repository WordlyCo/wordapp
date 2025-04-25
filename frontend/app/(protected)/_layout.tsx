import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { View } from "react-native";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import { useStore } from "@/src/stores/store";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const { colors } = useAppTheme();

  const user = useStore((state) => state.user);
  const isFetchingUser = useStore((state) => state.isFetchingUser);
  const fetchMe = useStore((state) => state.getMe);

  useEffect(() => {
    if (!user && !isFetchingUser) {
      fetchMe();
    }
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar
        style={
          (user?.preferences?.theme as StatusBarStyle) === "dark"
            ? "light"
            : "dark"
        }
      />
      <SafeAreaView
        edges={["left", "right"]}
        style={{ backgroundColor: colors.surface }}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </View>
  );
}
