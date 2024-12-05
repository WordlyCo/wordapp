import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { ProgressBar, Button as PaperButton } from "react-native-paper"; // For progress bar
import useTheme from "@/hooks/useTheme";

// Sample leaderboard data
const globalLeaderboard = [
  { id: "1", name: "Alice", points: 1500 },
  { id: "2", name: "Bob", points: 1400 },
  { id: "3", name: "You", points: 1200 },
  { id: "4", name: "Charlie", points: 1100 },
];

const friendsLeaderboard = [
  { id: "1", name: "Friend 1", points: 1300 },
  { id: "2", name: "You", points: 1200 },
  { id: "3", name: "Friend 2", points: 1000 },
];

// Levels for leveling system, can add more later
const levels = [
  { level: 1, minPoints: 0 },
  { level: 2, minPoints: 500 },
  { level: 3, minPoints: 1000 },
  { level: 4, minPoints: 1500 },
  { level: 5, minPoints: 2000 },
];

// Sample stats for personal best stats display
const personalStats = {
  highestScore: 350,
  averageScore: 200,
  gamesPlayed: 20,
};

// Helper function to calculate level
const getCurrentLevel = (points: any) => {
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
const Leaderboard = ({ data }: any) => {
  const { colors } = useTheme();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View
          style={[
            styles.row,
            { borderColor: colors.inversePrimary },
            item.name === "You" && { backgroundColor: colors.tertiary },
          ]}
        >
          <Text
            style={[
              styles.rank,
              { color: item.name === "You" ? "white" : colors.onSurface },
            ]}
          >
            {index + 1}
          </Text>
          <Text
            style={[
              styles.name,
              { color: item.name === "You" ? "white" : colors.onSurface },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.points,
              { color: item.name === "You" ? "white" : colors.onSurface },
            ]}
          >
            {item.points} pts
          </Text>
        </View>
      )}
    />
  );
};

// Global Leaderboard Screen
const GlobalLeaderboard = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: colors.onSurface }]}>
        Global Leaderboard
      </Text>
      <Leaderboard data={globalLeaderboard} />
    </View>
  );
};

// Friends Leaderboard Screen
const FriendsLeaderboard = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: colors.onSurface }]}>
        Friends Leaderboard
      </Text>
      <Leaderboard data={friendsLeaderboard} />
    </View>
  );
};

// User Level and Progress Bar
const UserLevel = ({ userPoints }: any) => {
  const { currentLevel, nextLevel } = getCurrentLevel(userPoints);
  const { colors } = useTheme();

  // Calculate progress as a percentage
  const progress =
    nextLevel && nextLevel.minPoints > currentLevel.minPoints
      ? (userPoints - currentLevel.minPoints) /
        (nextLevel.minPoints - currentLevel.minPoints)
      : 1; // Max level reached

  return (
    <View style={[styles.levelRow, { backgroundColor: "#292729" }]}>
      <View
        style={[
          styles.progressFill,
          { backgroundColor: colors.progress },
          { width: `${progress * 100}%` }, // Baby blue
        ]}
      />
      <Text style={[styles.levelRowText, { color: "white" }]}>
        Your Level: {currentLevel.level} |{" "}
        {nextLevel
          ? `${nextLevel.minPoints - userPoints} points to Level ${nextLevel.level}`
          : "Max Level Reached"}
      </Text>
    </View>
  );
};

// Modal for Personal Best Stats
const PersonalBestModal = ({ visible, onClose }: any) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.statsHeader}>Personal Best</Text>
        <Text style={styles.statsText}>
          Highest Score: {personalStats.highestScore}
        </Text>
        <Text style={styles.statsText}>
          Average Score: {personalStats.averageScore}
        </Text>
        <Text style={styles.statsText}>
          Games Played: {personalStats.gamesPlayed}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Main Progress Screen
const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState("Global"); // Track active tab
  const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
  const userPoints = 1200; // Replace this with actual user points from state/backend
  const { colors } = useTheme();

  const renderTabContent = () => {
    if (activeTab === "Global") {
      return <GlobalLeaderboard />;
    } else if (activeTab === "Friends") {
      return <FriendsLeaderboard />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tab Switcher */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        <Button
          title="Global"
          onPress={() => setActiveTab("Global")}
          color={
            activeTab === "Global" ? colors.onSurface : colors.onSurfaceDisabled
          }
        />
        <Button
          title="Friends"
          onPress={() => setActiveTab("Friends")}
          color={
            activeTab === "Friends"
              ? colors.onSurface
              : colors.onSurfaceDisabled
          }
        />
      </View>
      {/* Leveling System */}
      <UserLevel userPoints={userPoints} />
      {/* Render Active Tab */}
      {renderTabContent()}

      {/* Button to View Personal Best Stats */}
      <View style={styles.buttonContainer}>
        <PaperButton mode="contained" onPress={() => setModalVisible(true)}>
          My Best Scores
        </PaperButton>
      </View>

      {/* Personal Best Modal */}
      <PersonalBestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  rank: { fontSize: 18, fontWeight: "bold" },
  name: { fontSize: 18 },
  points: { fontSize: 18, fontWeight: "bold" },
  highlight: { backgroundColor: "#d1f7c4" },

  // Updated Level Row Styles
  levelRow: {
    height: 40,
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    overflow: "hidden", // Ensures the fill doesn't go outside the box
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    color: "white",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#b3d9ff", // Baby blue for progress
  },
  levelRowText: {
    color: "#333", // Dark text for readability
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#5856D6",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  statsText: { fontSize: 16, color: "#666" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    backgroundColor: "#282828",
  },
});

export default ProgressScreen;
