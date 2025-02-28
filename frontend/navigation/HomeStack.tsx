import { createStackNavigator } from "@react-navigation/stack";
import HomeTab from "@/screens/HomeTab";
import CategoryList from "@/screens/CategoryList";
import MultipleChoice from "@/screens/GameScreens/MultipleChoice";
import SentenceSage from "@/screens/GameScreens/SentenceSage";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeTab} />
      <Stack.Screen name="CategoryList" component={CategoryList} />
      <Stack.Screen name="MultipleChoice" component={MultipleChoice} />
      <Stack.Screen name="SentenceSage" component={SentenceSage} />
    </Stack.Navigator>
  );
};

export default HomeStack;
