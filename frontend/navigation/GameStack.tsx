import { createStackNavigator } from "@react-navigation/stack";
import MultipleChoice from "@/screens/GameScreens/MultipleChoice";
import useTheme from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import GameScreen from "@/screens/GameScreens/GameScreen";

const Stack = createStackNavigator();

const GameStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GameMain" component={GameScreen} />
      <Stack.Screen name="MultipleChoice" component={MultipleChoice} />
    </Stack.Navigator>
  );
};

export default GameStack;
