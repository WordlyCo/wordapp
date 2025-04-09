import { createStackNavigator } from "@react-navigation/stack";
import StoreTab from "@/screens/StoreTab";
import CategoryList from "@/screens/WordLists";
import ListDetails from "@/screens/ListDetails";

const Stack = createStackNavigator();

const StoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StoreMain" component={StoreTab} />
      <Stack.Screen name="CategoryList" component={CategoryList} />
      <Stack.Screen name="ListDetails" component={ListDetails} />
    </Stack.Navigator>
  );
};

export default StoreStack;
