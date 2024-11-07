import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from '@expo/vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => (
  <Tab.Navigator 
    initialRouteName="Home"
    barStyle={{ marginBottom: -40, backgroundColor: "#282828"}}
    activeColor={"#FFFFFF"}
    inactiveColor={"#FFFFFF"}
    activeIndicatorStyle={{
      backgroundColor:"#5856D6",
      borderRadius: 12
    }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let iconName: any; 
        const color = focused ? "#FFFFFF" : "#FFFFFF"
        
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home';
            return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        } else if (route.name === 'Quiz') {
          iconName = focused ? 'cards-playing' : 'cards-playing';
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        } else if (route.name === 'Progress') {
          iconName = focused ? 'chart-line-stacked' : 'chart-line-stacked';
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        } else if (route.name === 'Profile') {
          iconName = focused ? 'user' : 'user';
          return <FontAwesomeIcons name={iconName} size={26} color={color} />;
        }

        return null;
      },
    })}
  >
   
    <Tab.Screen name="Home" component={HomeScreen}/>
    <Tab.Screen name="Quiz" component={HomeScreen}/>
    <Tab.Screen name="Progress" component={HomeScreen}/>
    <Tab.Screen name="Profile" component={HomeScreen}/>
  </Tab.Navigator>
);

export default AppStack;
