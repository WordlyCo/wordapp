import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "@/src/hooks/useTheme";
import { useColorScheme, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
