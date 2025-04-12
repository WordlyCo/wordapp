import { useEffect } from "react";
import { useSegments, useRouter, useNavigationContainerRef } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useStore } from "@/src/stores/store";
import { Platform } from "react-native";

const PROTECTED_ROUTE = "/(protected)/(tabs)/home" as const;
const AUTH_ROUTE = "/(auth)" as const;

export function AuthGuard() {
  const segments = useSegments();
  const { isLoading } = useAuth();
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { isAuthenticated } = useStore();
  const rootNavigation = useNavigationContainerRef();
  const router = useRouter();

  useEffect(() => {
    // Wait for navigation, Clerk, and our data to be ready
    if (!rootNavigation?.isReady() || !isLoaded || isLoading) return;

    const currentGroup = segments[0];
    const inAuthGroup = currentGroup === "(auth)";

    const navigateToPath = (
      path: typeof PROTECTED_ROUTE | typeof AUTH_ROUTE
    ) => {
      if (Platform.OS === "web") {
        setTimeout(() => {
          router.replace(path);
        }, 0);
      } else {
        router.replace(path);
      }
    };

    // If user is not signed in with Clerk, redirect to auth
    if (!isSignedIn) {
      navigateToPath(AUTH_ROUTE);
      return;
    }

    // If user is signed in with Clerk but not in our database, redirect to auth
    // This handles the case where a user has a Clerk account but no record in our database
    if (isSignedIn && !isAuthenticated) {
      navigateToPath(AUTH_ROUTE);
      return;
    }

    // If user is fully authenticated and on auth screen, redirect to home
    if (isSignedIn && isAuthenticated && inAuthGroup) {
      navigateToPath(PROTECTED_ROUTE);
    }
  }, [
    isLoading,
    isLoaded,
    isSignedIn,
    isAuthenticated,
    segments,
    rootNavigation?.isReady(),
  ]);

  return null;
}
