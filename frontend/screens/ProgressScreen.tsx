import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // For progress bar

// Dummy leaderboard data
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

// Levels for leveling system
const levels = [
  { level: 1, minPoints: 0 },
  { level: 2, minPoints: 500 },
  { level: 3, minPoints: 1000 },
  { level: 4, minPoints: 1500 },
  { level: 5, minPoints: 2000 },
];

// Dummy stats for personal best
const personalStats = {
  highestScore: 350,
  averageScore: 200,
  gamesPlayed: 20,
};

// Helper function to calculate level
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
  console.log("Rendering GlobalLeaderboard");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Leaderboard</Text>
      <Leaderboard data={globalLeaderboard} />
    </View>
  );
};

// Friends Leaderboard Screen
const FriendsLeaderboard = () => {
  console.log("Rendering FriendsLeaderboard");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends Leaderboard</Text>
      <Leaderboard data={friendsLeaderboard} />
    </View>
  );
};

// User Level and Progress Bar
const UserLevel = ({ userPoints }) => {
  const { currentLevel, nextLevel } = getCurrentLevel(userPoints);

  // Calculate progress as a percentage
  const progress =
    nextLevel && nextLevel.minPoints > currentLevel.minPoints
      ? (userPoints - currentLevel.minPoints) /
        (nextLevel.minPoints - currentLevel.minPoints)
      : 1; // Max level

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
      {/* Progress Bar */}
      <ProgressBar
        progress={progress}
        color="#5856D6"
        style={styles.progressBar}
      />
    </View>
  );
};

// Personal Best Stats Component
const PersonalBestStats = () => (
  <View style={styles.statsBox}>
    <Text style={styles.statsHeader}>Personal Best</Text>
    <Text style={styles.statsText}>Highest Score: {personalStats.highestScore}</Text>
    <Text style={styles.statsText}>Average Score: {personalStats.averageScore}</Text>
    <Text style={styles.statsText}>Games Played: {personalStats.gamesPlayed}</Text>
  </View>
);

// Main Progress Screen
const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState('Global'); // Track active tab
  const userPoints = 1200; // Replace this with actual user points from state/backend

  const renderTabContent = () => {
    if (activeTab === 'Global') {
      return <GlobalLeaderboard />;
    } else if (activeTab === 'Friends') {
      return <FriendsLeaderboard />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <Button
          title="Global"
          onPress={() => setActiveTab('Global')}
          color={activeTab === 'Global' ? '#FFFFFF' : '#AAAAAA'}
        />
        <Button
          title="Friends"
          onPress={() => setActiveTab('Friends')}
          color={activeTab === 'Friends' ? '#FFFFFF' : '#AAAAAA'}
        />
      </View>

      {/* Render Active Tab */}
      {renderTabContent()}

      {/* Leveling System */}
      <UserLevel userPoints={userPoints} />

      {/* Personal Best Stats */}
      <PersonalBestStats />
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
  highlight: { backgroundColor: '#d1f7c4' }, // Highlight the user row
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
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
  },
  statsBox: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statsText: { fontSize: 16, color: '#666' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#282828',
  },
});

export default ProgressScreen;



