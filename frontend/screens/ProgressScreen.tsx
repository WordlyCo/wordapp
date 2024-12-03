import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

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

// Global Leaderboard Component
const GlobalLeaderboard = () => {
  console.log("Rendering GlobalLeaderboard");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Leaderboard</Text>
      {globalLeaderboard.map((item, index) => (
        <Text key={item.id}>
          {index + 1}. {item.name} - {item.points} pts
        </Text>
      ))}
    </View>
  );
};

// Friends Leaderboard Component
const FriendsLeaderboard = () => {
  console.log("Rendering FriendsLeaderboard");
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends Leaderboard</Text>
      {friendsLeaderboard.map((item, index) => (
        <Text key={item.id}>
          {index + 1}. {item.name} - {item.points} pts
        </Text>
      ))}
    </View>
  );
};

// User Level Display Component
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
          color={activeTab === 'Global' ? '#5856D6' : '#282828'}
        />
        <Button
          title="Friends"
          onPress={() => setActiveTab('Friends')}
          color={activeTab === 'Friends' ? '#5856D6' : '#282828'}
        />
      </View>

      {/* Render Active Tab */}
      {renderTabContent()}

      {/* Leveling System */}
      <UserLevel userPoints={userPoints} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#282828',
  },
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

