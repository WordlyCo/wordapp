import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Dummy data for leaderboards
const globalLeaderboard = [
  { id: '1', name: 'Alice', points: 1500 },
  { id: '2', name: 'Bob', points: 1400 },
  { id: '3', name: 'You', points: 1200 },
  { id: '4', name: 'Charlie', points: 1100 },
];

const friendsLeaderboard = [
  { id: '1', name: 'Your Best Friend', points: 1300 },
  { id: '2', name: 'You', points: 1200 },
  { id: '3', name: 'Another Friend', points: 1000 },
];

// Leaderboard components
const GlobalLeaderboard = () => {
  console.log("Rendering GlobalLeaderboard");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Leaderboard</Text>
      {globalLeaderboard.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.rank}>{index + 1}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.points}>{item.points} pts</Text>
        </View>
      ))}
    </View>
  );
};

const FriendsLeaderboard = () => {
  console.log("Rendering FriendsLeaderboard");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends Leaderboard</Text>
      {friendsLeaderboard.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.rank}>{index + 1}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.points}>{item.points} pts</Text>
        </View>
      ))}
    </View>
  );
};

const ProgressScreen = () => {
  console.log("Rendering ProgressScreen");

  return (
    <Tab.Navigator
      lazy
      screenOptions={{
        tabBarStyle: { backgroundColor: '#282828' },
        tabBarIndicatorStyle: { backgroundColor: '#5856D6', height: 4 },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#BBBBBB',
        unmountOnBlur: true, // Force unmount when the tab is inactive
      }}
    >
      <Tab.Screen name="Global" component={GlobalLeaderboard} />
      <Tab.Screen name="Friends" component={FriendsLeaderboard} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rank: { fontSize: 18, fontWeight: 'bold' },
  name: { fontSize: 18 },
  points: { fontSize: 18, fontWeight: 'bold' },
});

export default ProgressScreen;

