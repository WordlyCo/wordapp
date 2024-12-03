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

const ProgressScreen = () => (
  <Tab.Navigator>
    <Tab.Screen name="Global" component={GlobalLeaderboard} />
    <Tab.Screen name="Friends" component={FriendsLeaderboard} />
  </Tab.Navigator>
);

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
  highlight: { backgroundColor: '#d1f7c4' }, // Highlight the user row
});

export default ProgressScreen;



