import React from "react";
import { useRouter } from "expo-router";

// This creates a navigation object compatible with react-navigation
// that we can pass to components that expect react-navigation
export function createNavigationAdapter() {
  const router = useRouter();

  return {
    navigate: (routeName: string, params?: Record<string, any>) => {
      try {
        // Map old routes to new expo-router paths
        switch (routeName) {
          case "Home":
            router.navigate("/(app)/home");
            break;
          case "Store":
            router.navigate("/(app)/store");
            break;
          case "Progress":
            router.navigate("/(app)/progress");
            break;
          case "Bank":
            router.navigate("/(app)/bank");
            break;
          case "Profile":
            router.navigate("/(app)/profile");
            break;
          case "WordLists":
            router.navigate("/(app)/store/lists");
            break;
          case "ListDetails":
            if (params?.listId) {
              router.navigate({
                pathname: "/(app)/store/lists/[id]",
                params: { id: params.listId },
              });
            }
            break;
          default:
            console.warn(`Route not mapped: ${routeName}`);
        }
      } catch (e) {
        console.error("Navigation error:", e);
      }
    },
    goBack: () => {
      router.back();
    },
  };
}

// Higher-order component to inject navigation to legacy components
export function withExpoRouter(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const navigation = createNavigationAdapter();
    return <Component {...props} navigation={navigation} />;
  };
}
