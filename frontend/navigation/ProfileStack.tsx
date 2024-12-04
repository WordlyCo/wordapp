import { createStackNavigator } from "@react-navigation/stack";
import HelpCenterScreen from "../screens/HelpCenterScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import Preferences from "../screens/PreferencesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import useTheme from "@/hooks/useTheme";

const Stack = createStackNavigator();

const ProfileStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerStatusBarHeight: 0,
        headerTitleStyle: {
          color: colors.onSurface,
        },
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="Preferences" component={Preferences} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
