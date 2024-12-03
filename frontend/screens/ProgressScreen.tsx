import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Sample leaderboard data of how global leaderboard would look like
const globalLeaderboard = [
  { id: '1', name: 'Alice', points: 1500 },
  { id: '2', name: 'Bob', points: 1400 },
  { id: '3', name: 'You', points: 1200 },
  { id: '4', name: 'Charlie', points: 1100 },
];

const friendsLeaderboard = [
  { id: '1', name: 'Friend 1', points: 1300 },
  { id: '2', name: 'You', points: 1200 },
  { id: '3', name: 'Friend 2', points: 1000 },
];

// Levels for leveling system
const levels = [
  { level: 1, minPoints: 0 },
  { level: 2, minPoints: 500 },
  { level: 3, minPoints: 1000 },
  { level: 4, minPoints: 1500 },
  { level: 5, minPoints: 2000 }, //Need to figure out how to create level ranking boundaries
];

//  function to calculate level and how many more points to get to next level
const getCurrentLevel = (points) => {
  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].minPoints) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null; // Handle max level
    }
  }
  return { currentLevel, nextLevel };
};

// Leaderboard Component
const Leaderboard = ({ data }) => (
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

// Global Leaderboard Screen
const GlobalLeaderboard = () => {
  console.log("Rendering GlobalLeaderboard"); //for testing to see if screen is rendering for every tab switch
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Leaderboard</Text>
      <Leaderboard data={globalLeaderboard} />
    </View>
  );
};

// Friends Leaderboard Screen
const FriendsLeaderboard = () => {
  console.log("Rendering FriendsLeaderboard"); //testing tab switching through logging
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends Leaderboard</Text>
      <Leaderboard data={friendsLeaderboard} />
    </View>
  );
};

// User Level Display Function
const UserLevel = ({ userPoints }) => {
  const { currentLevel, nextLevel } = getCurrentLevel(userPoints);

  return (
    <View style={styles.levelBox}>
      <Text style={styles.levelText}>Your Level: {currentLevel.level}</Text>
      {nextLevel ? (
        <Text style={styles.pointsText}>
          {nextLevel.minPoints - userPoints} points to Level {nextLevel.level}
        </Text>
      ) : (
        <Text style={styles.pointsText}>Max Level Reached</Text>
      )}
    </View>
  );
};

// Main Progress Screen with Tabs and Leveling System
const ProgressScreen = () => {
  const userPoints = 1200; // Replace this with actual user points from state/backend

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        lazy // Load tabs only when they become active
        screenOptions={{
          tabBarStyle: { backgroundColor: '#282828' },
          tabBarIndicatorStyle: { backgroundColor: '#5856D6', height: 4 },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#BBBBBB',
          unmountOnBlur: true, // Unmount inactive tabs to force re-rendering
        }}
      >
        <Tab.Screen name="Global" component={GlobalLeaderboard} />
        <Tab.Screen name="Friends" component={FriendsLeaderboard} />
      </Tab.Navigator>
      <UserLevel userPoints={userPoints} />
    </View>
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
  highlight: { backgroundColor: '#d1f7c4' },
  levelBox: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  levelText: { fontSize: 20, fontWeight: 'bold' },
  pointsText: { fontSize: 16, color: '#666' },
});

export default ProgressScreen;
