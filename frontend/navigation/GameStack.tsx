import { createStackNavigator } from "@react-navigation/stack";
import MultipleChoice from "@/screens/GameScreens/MultipleChoice";
import GameScreen from "@/screens/GamesTab";
import SentenceSage from "@/screens/GameScreens/SentenceSage";

const Stack = createStackNavigator();

const GameStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GameMain" component={GameScreen} />
      <Stack.Screen name="MultipleChoice" component={MultipleChoice} />
      <Stack.Screen name="SentenceSage" component={SentenceSage} />
    </Stack.Navigator>
  );
};

export default GameStack;
