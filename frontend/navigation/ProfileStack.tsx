import { createStackNavigator } from "@react-navigation/stack";
import HelpCenterScreen from "@/screens/ProfileScreens/HelpCenterScreen";
import PrivacyPolicyScreen from "@/screens/ProfileScreens/PrivacyPolicyScreen";
import Preferences from "@/screens/ProfileScreens/PreferencesScreen";
import ProfileScreen from "@/screens/AppScreens/ProfileScreen";
import AccountSettingsScreen from "@/screens/ProfileScreens/AccountSettingsScreen";
import useTheme from "@/hooks/useTheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
          color: "#4F4CCD",
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
