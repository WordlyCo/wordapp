import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

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

// Points needed for each level
const levels = [
  { level: 1, minPoints: 0 },
  { level: 2, minPoints: 500 },
  { level: 3, minPoints: 1000 },
  { level: 4, minPoints: 1500 },
  { level: 5, minPoints: 2000 },
];

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

const GlobalLeaderboard = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Global Leaderboard</Text>
    <Leaderboard data={globalLeaderboard} />
  </View>
);

const FriendsLeaderboard = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Friends Leaderboard</Text>
    <Leaderboard data={friendsLeaderboard} />
  </View>
);

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

const ProgressScreen = () => {
  const userPoints = 1200; // Replace this with dynamic data from your backend or state

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Global" component={GlobalLeaderboard} />
        <Tab.Screen name="Friends" component={FriendsLeaderboard} />
      </Tab.Navigator>
      <UserLevel userPoints={userPoints} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
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
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  levelText: { fontSize: 20, fontWeight: 'bold' },
  pointsText: { fontSize: 16, color: '#666' },
});

export default ProgressScreen;
