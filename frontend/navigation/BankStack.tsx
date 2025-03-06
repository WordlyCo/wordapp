import { createStackNavigator } from "@react-navigation/stack";
import BankTab from "@/screens/BankTab";
import CategoryList from "@/screens/CategoryList";
import ListDetails from "@/screens/ListDetails";

const Stack = createStackNavigator();

const BankStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BankMain" component={BankTab} />
      <Stack.Screen name="CategoryList" component={CategoryList} />
      <Stack.Screen name="ListDetails" component={ListDetails} />
    </Stack.Navigator>
  );
};

export default BankStack;
