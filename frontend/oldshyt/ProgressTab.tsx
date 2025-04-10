import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  SegmentedButtons,
  Portal,
  Modal,
  IconButton,
} from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";
import StickyHeader from "@/src/components/StickyHeader";
import StatCard from "@/src/components/StatCard";
import LeaderboardEntry from "@/src/components/LeaderboardEntry";
import LevelProgress from "@/src/components/LevelProgress";
import { useStore } from "@/stores/store";
import {
  globalLeaderboard,
  friendsLeaderboard,
  personalStats,
} from "@/stores/mockData";

const StatsModal = ({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal,
          {
            backgroundColor: colors.elevation.level5,
          },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text variant="headlineSmall" style={{ color: colors.onSurface }}>
            Your Stats
          </Text>
          <IconButton
            icon="close"
            onPress={onDismiss}
            iconColor={colors.onSurface}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="trophy"
            value={personalStats.highestScore}
            label="Best Score"
            color={colors.primary}
          />
          <StatCard
            icon="school"
            value={personalStats.wordsLearned}
            label="Words Learned"
            color={colors.secondary}
          />
          <StatCard
            icon="target"
            value={`${personalStats.accuracy}%`}
            label="Accuracy"
            color={colors.tertiary}
          />
          <StatCard
            icon="controller-classic"
            value={personalStats.gamesPlayed}
            label="Games Played"
            color={colors.error}
          />
        </View>
      </Modal>
    </Portal>
  );
};

const ProgressTab = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("global");
  const [statsVisible, setStatsVisible] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />

      <View style={styles.content}>
        <LevelProgress points={1200} />

        <View style={styles.leaderboardContainer}>
          <View style={styles.leaderboardHeader}>
            <Text variant="headlineSmall" style={{ color: colors.onSurface }}>
              Leaderboard
            </Text>
            <IconButton
              icon="trophy"
              mode="contained"
              containerColor={colors.primaryContainer}
              iconColor={colors.primary}
              onPress={() => setStatsVisible(true)}
            />
          </View>

          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              { value: "global", label: "Global" },
              { value: "friends", label: "Friends" },
            ]}
            style={styles.segmentedButtons}
          />

          <View style={styles.leaderboardList}>
            {(activeTab === "global"
              ? globalLeaderboard
              : friendsLeaderboard
            ).map((entry, index) => (
              <LeaderboardEntry key={entry.id} entry={entry} rank={index + 1} />
            ))}
          </View>
        </View>
      </View>

      <StatsModal
        visible={statsVisible}
        onDismiss={() => setStatsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  leaderboardContainer: {
    flex: 1,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  leaderboardList: {
    flex: 1,
    gap: 8,
  },
  modal: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statsGrid: {
    gap: 12,
  },
});

export default ProgressTab;
