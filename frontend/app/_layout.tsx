import React, { useEffect, useState } from "react";
import { Stack, SplashScreen } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Toast, { ToastConfigParams } from "react-native-toast-message";
import useTheme from "@/src/hooks/useTheme";
import { AuthProvider } from "@/src/contexts/AuthContext";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync().catch(() => {});
export default function RootLayout() {
  const { theme, colors } = useTheme();
  const [isReady, setIsReady] = useState(false);

  const toastConfig = {
    success: ({ text1, text2 }: ToastConfigParams<any>) => (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={[styles.toastContainer, { backgroundColor: colors.success }]}
      >
        <MaterialCommunityIcons name="check-circle" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 ? <Text style={styles.message}>{text2}</Text> : null}
        </View>
      </Animated.View>
    ),
    error: ({ text1, text2 }: ToastConfigParams<any>) => (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={[styles.toastContainer, { backgroundColor: colors.error }]}
      >
        <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 ? <Text style={styles.message}>{text2}</Text> : null}
        </View>
      </Animated.View>
    ),
    info: ({ text1, text2 }: ToastConfigParams<any>) => (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={[styles.toastContainer, { backgroundColor: colors.primary }]}
      >
        <MaterialCommunityIcons name="information" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 ? <Text style={styles.message}>{text2}</Text> : null}
        </View>
      </Animated.View>
    ),
    warning: ({ text1, text2 }: ToastConfigParams<any>) => (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={[
          styles.toastContainer,
          { backgroundColor: colors.warning || "#FF9800" },
        ]}
      >
        <MaterialCommunityIcons name="alert" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 ? <Text style={styles.message}>{text2}</Text> : null}
        </View>
      </Animated.View>
    ),
  };

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch {
        // not logging since not an actual error
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName="index"
              >
                <Stack.Screen name="(public)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(protected)" />
              </Stack>
              <Toast config={toastConfig} position="bottom" />
            </AuthProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    marginHorizontal: "5%",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    color: "white",
    fontSize: 14,
    marginTop: 2,
  },
});
