import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import HomeScreen from "@/screens/AppScreens/HomeScreen";
import ProgressScreen from "@/screens/AppScreens/ProgressScreen";
import GameScreen from "@/screens/AppScreens/GameScreen";
import ProfileStack from "./ProfileStack";
import useTheme from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
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
            let iconName: any;
            const color = focused ? "white" : colors.onSurface;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={26}
                  color={color}
                />
              );
            } else if (route.name === "Games") {
              iconName = focused ? "cards-playing" : "cards-playing";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={26}
                  color={color}
                />
              );
            } else if (route.name === "Progress") {
              iconName = focused ? "chart-line-stacked" : "chart-line-stacked";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={26}
                  color={color}
                />
              );
            } else if (route.name === "Profile") {
              iconName = focused ? "user" : "user";
              return (
                <FontAwesomeIcons name={iconName} size={26} color={color} />
              );
            }

            return null;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Games" component={GameScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppStack;
