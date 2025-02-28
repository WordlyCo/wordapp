import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProgressTab from "@/screens/ProgressTab";
import ProfileStack from "./ProfileStack";
import useTheme from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import BankStack from "./BankStack";
import HomeStack from "./HomeStack";

const Tab = createMaterialBottomTabNavigator();

const AppTabs = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <Tab.Navigator
        initialRouteName="Home"
        barStyle={{
          marginBottom: -40,
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowRadius: 5,
          shadowOpacity: 1,
        }}
        activeColor={colors.onSurface}
        inactiveColor={colors.onSurface}
        activeIndicatorStyle={{
          backgroundColor: colors.primary,
          borderRadius: 12,
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
            const color = focused ? "white" : colors.onSurface;

            switch (route.name) {
              case "Home":
                iconName = "home";
                break;
              case "Bank":
                iconName = "cards-playing";
                break;
              case "Progress":
                iconName = "chart-line-stacked";
                break;
              case "Profile":
                iconName = "account";
                break;
              default:
                iconName = "help";
            }

            return (
              <MaterialCommunityIcons name={iconName} size={26} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Bank" component={BankStack} />
        <Tab.Screen name="Progress" component={ProgressTab} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppTabs;
