import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useStore } from "@/src/stores/store";
import { updateCachedToken, setClerkTokenGetter } from "@/lib/api";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";

interface AuthContextType {
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isAuthenticated,
    hasOnboarded,
    getMe,
    logout: logoutStore,
    loadOnboardingStatus,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { isSignedIn, isLoaded, getToken, signOut } = useClerkAuth();

  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      const getMyToken = async () => {
        try {
          const token = await getToken();
          return token;
        } catch (error) {
          console.error("Failed to get token:", error);
          return null;
        }
      };

      getMyToken();
    }
  }, [isLoaded, getToken]);

  useEffect(() => {
    if (isLoaded) {
      try {
        setClerkTokenGetter(() => getToken());

        if (isSignedIn) {
          getToken()
            .then((token) => {
              if (token) updateCachedToken(token);
            })
            .catch((err) => {
              console.error("Failed to initialize token:", err);
            });
        }
      } catch (err) {
        console.error("Error setting up token getter:", err);
      }
    }
  }, [isLoaded, isSignedIn, getToken]);

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSignedIn) {
        await signOut();
      }
      await logoutStore();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout failed:", error);
      router.replace("/(auth)");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    const initialize = async () => {
      setIsLoading(true);
      try {
        try {
          await loadOnboardingStatus();
        } catch (error) {
          console.error("Failed to load onboarding status:", error);
        }

        if (isSignedIn) {
          try {
            await getMe();
          } catch (error) {
            console.error("Failed to get user data:", error);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    initialize();
  }, [isLoaded, isSignedIn, getMe, loadOnboardingStatus]);

  useEffect(() => {
    if (!hasInitialized || !isLoaded) return;

    const routeUser = async () => {
      try {
        if (!isSignedIn) {
          router.replace("/(public)");
        } else if (isSignedIn && isAuthenticated && !hasOnboarded) {
          router.replace("/(auth)/onboarding");
        } else if (isSignedIn && isAuthenticated) {
          router.replace("/(protected)/(tabs)/home");
        }
      } catch (error) {
        console.error("Routing error:", error);
        router.replace("/(public)");
      }
    };

    routeUser();
  }, [
    isAuthenticated,
    hasInitialized,
    isSignedIn,
    isLoaded,
    hasOnboarded,
    router,
  ]);

  return (
    <AuthContext.Provider value={{ isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
