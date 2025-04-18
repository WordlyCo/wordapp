import React from "react";
import { Stack } from "expo-router";
import useTheme from "@/src/hooks/useTheme";
import { View, StyleSheet, Text } from "react-native";
import { useTheme as usePaperTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileLayout() {
  const { colors } = useTheme();
  const { dark } = usePaperTheme();
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
        name="index"
        options={{
          title: "",
          headerLeft: () => (
            <Animated.View
              entering={FadeInDown.duration(600).springify()}
              style={styles.headerContainer}
            >
              <View style={styles.headerIconContainer}>
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color={dark ? colors.onSurface : colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.headerText,
                  { color: dark ? colors.onSurface : colors.primary },
                ]}
              >
                Profile
              </Text>
            </Animated.View>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <Stack.Screen name="Settings" />
      <Stack.Screen
        name="AccountSettings"
        options={{ headerTitle: "Account Settings" }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        options={{ headerTitle: "Privacy Policy" }}
      />
      <Stack.Screen name="Preferences" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerIconContainer: {
    marginRight: 10,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
