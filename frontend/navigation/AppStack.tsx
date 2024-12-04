import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from '@expo/vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import ProgressScreen from '../screens/ProgressScreen';


import GameScreen from '../screens/GameScreen';

import HelpCenterScreen from '../screens/HelpCenterScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import SettingsScreen from '../screens/SettingsScreen';


const Tab = createMaterialBottomTabNavigator();

// Create a stack navigator for Profile tab
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="UserSettingsScreen" component={UserSettingsScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="HelpCenter" component={HelpCenterScreen} />
    <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
  </ProfileStack.Navigator>
);

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
        } else if (route.name === 'Games') {
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
    <Tab.Screen name="Games" component={GameScreen}/>
    <Tab.Screen name="Progress" component={ProgressScreen}/>
    <Tab.Screen name="Profile" component={ProfileStackScreen}/>
  </Tab.Navigator>
);

export default AppStack;
