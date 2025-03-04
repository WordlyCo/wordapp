import { createStackNavigator } from "@react-navigation/stack";
import HelpCenterScreen from "@/screens/ProfileScreens/HelpCenter";
import PrivacyPolicyScreen from "@/screens/ProfileScreens/PrivacyPolicy";
import Preferences from "@/screens/ProfileScreens/Preferences";
import ProfileScreen from "@/screens/ProfileScreens/Profile";
import AccountSettingsScreen from "@/screens/ProfileScreens/AccountSettings";
import useTheme from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Stack = createStackNavigator();

const ProfileStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          height: 50,
          shadowColor: colors.shadow,
        },
        headerStatusBarHeight: 0,
        headerBackTitleStyle: {
          color: colors.primary,
        },
        headerBackImage: (props) => {
          return (
            <MaterialCommunityIcons
              name="arrow-left"
              color={colors.primary}
              size={20}
              style={{ marginLeft: 10, marginRight: 5 }}
            />
          );
        },
        headerTitleStyle: {
          color: colors.onSurface,
          fontWeight: 700,
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        options={{ headerShown: false, headerTitle: "Profile" }}
        name="ProfileMain"
        component={ProfileScreen}
      />
      <Stack.Screen
        options={{ headerTitle: "Account Settings" }}
        name="AccountSettings"
        component={AccountSettingsScreen}
      />
      <Stack.Screen
        options={{ headerTitle: "Preferences" }}
        name="Preferences"
        component={Preferences}
      />
      <Stack.Screen
        options={{ headerTitle: "Help Center" }}
        name="HelpCenter"
        component={HelpCenterScreen}
      />
      <Stack.Screen
        options={{ headerTitle: "Privacy Policy" }}
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
