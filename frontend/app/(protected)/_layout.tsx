import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "@/src/hooks/useTheme";
import { View } from "react-native";

export default function ProtectedLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
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
