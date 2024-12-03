import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Data for the leaderboards
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

// Reusable leaderboard component
const Leaderboard = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={[styles.row, item.name === 'You' && styles.highlight]}>
          <Text style={styles.rank}>{index + 1}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.points}>{item.points} pts</Text>
        </View>
      )}
    />
  );
};

// Global Leaderboard Screen
const GlobalLeaderboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Leaderboard</Text>
      <Leaderboard data={globalLeaderboard} />
    </View>
  );
};

// Friends Leaderboard Screen
const FriendsLeaderboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends Leaderboard</Text>
      <Leaderboard data={friendsLeaderboard} />
    </View>
  );
};

// Main Progress Screen with Tabs
const ProgressScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Global" component={GlobalLeaderboard} />
      <Tab.Screen name="Friends" component={FriendsLeaderboard} />
    </Tab.Navigator>
 

