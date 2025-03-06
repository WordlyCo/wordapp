import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProgressTab from "@/screens/ProgressTab";
import ProfileStack from "./ProfileStack";
import useTheme from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import BankStack from "./BankStack";
import HomeStack from "./HomeStack";
import StoreStack from "./StoreStack";

const Tab = createMaterialBottomTabNavigator();

const AppTabs = () => {
  const { colors } = useTheme();

  const getTabBarIcon = (route: any, focused: boolean) => {
    let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
    const color = focused ? "white" : colors.onSurface;

    switch (route.name) {
      case "Home":
        iconName = "home";
        break;
      case "Store":
        iconName = "book";
        break;
      case "Progress":
        iconName = "chart-line-stacked";
        break;
      case "Bank":
        iconName = "bank";
        break;
      case "Profile":
        iconName = "account";
        break;
      default:
        iconName = "help";
    }

    return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
  };

  return (
    <SafeAreaView
      style={[styles.safeAreaView, { backgroundColor: colors.surface }]}
    >
      <Tab.Navigator
        initialRouteName="Home"
        barStyle={[
          styles.tabBar,
          { backgroundColor: colors.surface, shadowColor: colors.shadow },
        ]}
        activeColor={colors.onSurface}
        inactiveColor={colors.onSurface}
        activeIndicatorStyle={{
          backgroundColor: colors.primary,
          borderRadius: 12,
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => getTabBarIcon(route, focused),
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Store" component={StoreStack} />
        <Tab.Screen name="Progress" component={ProgressTab} />
        <Tab.Screen name="Bank" component={BankStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppTabs;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  tabBar: {
    marginBottom: -40,
    shadowRadius: 5,
    shadowOpacity: 1,
  },
});
