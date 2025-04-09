import { createStackNavigator } from "@react-navigation/stack";
import HomeTab from "@/screens/HomeTab";
import WordLists from "@/screens/WordLists";
import ListDetails from "@/screens/ListDetails";
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
      <Stack.Screen name="WordLists" component={WordLists} />
      <Stack.Screen name="ListDetails" component={ListDetails} />
      <Stack.Screen name="MultipleChoice" component={MultipleChoice} />
      <Stack.Screen name="SentenceSage" component={SentenceSage} />
    </Stack.Navigator>
  );
};

export default HomeStack;
