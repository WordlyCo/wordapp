import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useStore } from "@/src/stores/store";
import { updateCachedToken, setClerkTokenGetter } from "@/lib/api";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    getMe: fetchMe,
    isAuthenticated,
    logout: logoutStore,
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { isSignedIn, isLoaded, getToken, signOut } = useClerkAuth();

  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      setClerkTokenGetter(() => getToken());
    }
  }, [isLoaded, getToken]);

  const refreshTokenCache = async () => {
    try {
      if (isSignedIn) {
        const token = await getToken();
        updateCachedToken(token);
        return token;
      } else {
        updateCachedToken(null);
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token cache:", error);
      return null;
    }
  };

  const getMe = async () => {
    setIsLoading(true);
    try {
      await refreshTokenCache();
      await fetchMe();
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      refreshTokenCache()
        .then(() => {})
        .catch((err) =>
          console.error("Failed to initialize token cache:", err)
        );
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    const initialize = async () => {
      setIsLoading(true);
      try {
        if (isSignedIn) {
          const isFirstSignIn = !(await AsyncStorage.getItem(
            "hasCompletedSignIn"
          ));
          if (isFirstSignIn) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await AsyncStorage.setItem("hasCompletedSignIn", "true");
          }

          await refreshTokenCache();
          await getMe();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    initialize();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!hasInitialized || !isLoaded) return;

    const routeUser = async () => {
      try {
        if (isSignedIn && isAuthenticated) {
          router.replace("/(protected)/(tabs)/home");
        } else if (!isSignedIn) {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Routing error:", error);
      }
    };

    routeUser();
  }, [isAuthenticated, hasInitialized, isSignedIn, isLoaded]);

  return (
    <AuthContext.Provider value={{ user, isLoading, getMe, logout }}>
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
