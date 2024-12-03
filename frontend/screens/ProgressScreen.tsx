import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const GlobalLeaderboard = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Global Leaderboard</Text>
    <Text>Rank 1: Alice - 1500 pts</Text>
    <Text>Rank 2: Bob - 1400 pts</Text>
    <Text>Rank 3: You - 1200 pts</Text>
  </View>
);

const FriendsLeaderboard = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Friends Leaderboard</Text>
    <Text>Rank 1: Your Best Friend - 1300 pts</Text>
    <Text>Rank 2: You - 1200 pts</Text>
    <Text>Rank 3: Another Friend - 1000 pts</Text>
  </View>
);

const ProgressScreen = () => {
  return (
    <Tab.Navigator
      lazy
      screenOptions={{
        tabBarStyle: { backgroundColor: '#282828' },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#BBBBBB',
        tabBarIndicatorStyle: { backgroundColor: '#5856D6', height: 3 },
      }}
    >
      <Tab.Screen name="Global" component={GlobalLeaderboard} />
      <Tab.Screen name="Friends" component={FriendsLeaderboard} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default ProgressScreen;


