import ErrorBoundary from "@/src/components/ErrorBoundary";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { AppThemeProvider } from "@/src/contexts/ThemeContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

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
        <AppThemeProvider>
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
            </AuthProvider>
          </SafeAreaProvider>
        </AppThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
