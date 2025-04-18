import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Text,
  Card,
  Divider,
  ProgressBar,
  SegmentedButtons,
  IconButton,
} from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";

export default function ProgressScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("global");

  const userStats = {
    wordsLearned: 124,
    wordsToReview: 42,
    totalWords: 500,
    streak: 7,
    daysActive: 18,
    minutesLearned: 452,
    completedSets: 15,
    progress: {
      daily: 70,
      weekly: 85,
      monthly: 62,
    },
    recentActivities: [
      {
        id: "1",
        type: "quiz",
        date: "2023-08-15",
        score: "8/10",
        title: "Business Terminology Quiz",
      },
      {
        id: "2",
        type: "flashcards",
        date: "2023-08-14",
        score: "Completed",
        title: "Legal Terms Flashcards",
      },
      {
        id: "3",
        type: "matching",
        date: "2023-08-13",
        score: "95%",
        title: "Technology Terms Matching",
      },
    ],
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "help-circle-outline";
      case "flashcards":
        return "cards-outline";
      case "matching":
        return "puzzle-outline";
      default:
        return "book-open-variant";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.comingSoonText}>Coming Soon!</Text>
            <MaterialCommunityIcons
              name="timer-sand"
              size={24}
              color={colors.primary}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

// export default function ProgressScreen() {
//   const { colors } = useTheme();
//   const [activeTab, setActiveTab] = useState("global");

//   const userStats = {
//     wordsLearned: 124,
//     wordsToReview: 42,
//     totalWords: 500,
//     streak: 7,
//     daysActive: 18,
//     minutesLearned: 452,
//     completedSets: 15,
//     progress: {
//       daily: 70,
//       weekly: 85,
//       monthly: 62,
//     },
//     recentActivities: [
//       {
//         id: "1",
//         type: "quiz",
//         date: "2023-08-15",
//         score: "8/10",
//         title: "Business Terminology Quiz",
//       },
//       {
//         id: "2",
//         type: "flashcards",
//         date: "2023-08-14",
//         score: "Completed",
//         title: "Legal Terms Flashcards",
//       },
//       {
//         id: "3",
//         type: "matching",
//         date: "2023-08-13",
//         score: "95%",
//         title: "Technology Terms Matching",
//       },
//     ],
//   };

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case "quiz":
//         return "help-circle-outline";
//       case "flashcards":
//         return "cards-outline";
//       case "matching":
//         return "puzzle-outline";
//       default:
//         return "book-open-variant";
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Card style={[styles.card, { backgroundColor: colors.surface }]}>
//           <Card.Content style={styles.statsCardContent}>
//             <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
//               Your Learning Stats
//             </Text>

//             <View style={styles.statsGrid}>
//               <View style={styles.statItem}>
//                 <MaterialCommunityIcons
//                   name="book-open-variant"
//                   size={24}
//                   color={colors.primary}
//                 />
//                 <Text style={[styles.statValue, { color: colors.primary }]}>
//                   {userStats.wordsLearned}
//                 </Text>
//                 <Text
//                   style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
//                 >
//                   Words Learned
//                 </Text>
//               </View>

//               <View style={styles.statItem}>
//                 <MaterialCommunityIcons
//                   name="cached"
//                   size={24}
//                   color={colors.secondary}
//                 />
//                 <Text style={[styles.statValue, { color: colors.secondary }]}>
//                   {userStats.wordsToReview}
//                 </Text>
//                 <Text
//                   style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
//                 >
//                   To Review
//                 </Text>
//               </View>

//               <View style={styles.statItem}>
//                 <MaterialCommunityIcons
//                   name="fire"
//                   size={24}
//                   color={colors.streak}
//                 />
//                 <Text style={[styles.statValue, { color: colors.streak }]}>
//                   {userStats.streak}
//                 </Text>
//                 <Text
//                   style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
//                 >
//                   Day Streak
//                 </Text>
//               </View>

//               <View style={styles.statItem}>
//                 <MaterialCommunityIcons
//                   name="clock-outline"
//                   size={24}
//                   color={colors.timer}
//                 />
//                 <Text style={[styles.statValue, { color: colors.timer }]}>
//                   {userStats.minutesLearned}
//                 </Text>
//                 <Text
//                   style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
//                 >
//                   Minutes
//                 </Text>
//               </View>
//             </View>
//           </Card.Content>
//         </Card>

//         {/* Progress Bars */}
//         <Card style={[styles.card, { backgroundColor: colors.surface }]}>
//           <Card.Content>
//             <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
//               Progress Overview
//             </Text>

//             <View style={styles.progressSection}>
//               <View style={styles.progressRow}>
//                 <Text
//                   style={[
//                     styles.progressLabel,
//                     { color: colors.onSurfaceVariant },
//                   ]}
//                 >
//                   Daily Goal
//                 </Text>
//                 <Text
//                   style={[styles.progressPercent, { color: colors.primary }]}
//                 >
//                   {userStats.progress.daily}%
//                 </Text>
//               </View>
//               <ProgressBar
//                 progress={userStats.progress.daily / 100}
//                 color={colors.primary}
//                 style={styles.progressBar}
//               />
//             </View>

//             <View style={styles.progressSection}>
//               <View style={styles.progressRow}>
//                 <Text
//                   style={[
//                     styles.progressLabel,
//                     { color: colors.onSurfaceVariant },
//                   ]}
//                 >
//                   Weekly Goal
//                 </Text>
//                 <Text
//                   style={[styles.progressPercent, { color: colors.secondary }]}
//                 >
//                   {userStats.progress.weekly}%
//                 </Text>
//               </View>
//               <ProgressBar
//                 progress={userStats.progress.weekly / 100}
//                 color={colors.secondary}
//                 style={styles.progressBar}
//               />
//             </View>

//             <View style={styles.progressSection}>
//               <View style={styles.progressRow}>
//                 <Text
//                   style={[
//                     styles.progressLabel,
//                     { color: colors.onSurfaceVariant },
//                   ]}
//                 >
//                   Monthly Goal
//                 </Text>
//                 <Text
//                   style={[styles.progressPercent, { color: colors.tertiary }]}
//                 >
//                   {userStats.progress.monthly}%
//                 </Text>
//               </View>
//               <ProgressBar
//                 progress={userStats.progress.monthly / 100}
//                 color={colors.tertiary}
//                 style={styles.progressBar}
//               />
//             </View>
//           </Card.Content>
//         </Card>

//         {/* Recent Activities */}
//         <Card style={[styles.card, { backgroundColor: colors.surface }]}>
//           <Card.Content>
//             <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
//               Recent Activities
//             </Text>

//             {userStats.recentActivities.map((activity, index) => (
//               <React.Fragment key={activity.id}>
//                 <View style={styles.activityItem}>
//                   <MaterialCommunityIcons
//                     name={getActivityIcon(activity.type)}
//                     size={24}
//                     color={colors.primary}
//                     style={styles.activityIcon}
//                   />
//                   <View style={styles.activityDetails}>
//                     <Text
//                       style={[
//                         styles.activityTitle,
//                         { color: colors.onSurface },
//                       ]}
//                     >
//                       {activity.title}
//                     </Text>
//                     <Text
//                       style={[
//                         styles.activityDate,
//                         { color: colors.onSurfaceVariant },
//                       ]}
//                     >
//                       {activity.date}
//                     </Text>
//                   </View>
//                   <View style={styles.activityScore}>
//                     <Text style={[styles.scoreText, { color: colors.primary }]}>
//                       {activity.score}
//                     </Text>
//                   </View>
//                 </View>
//                 {index < userStats.recentActivities.length - 1 && (
//                   <Divider style={styles.activityDivider} />
//                 )}
//               </React.Fragment>
//             ))}
//           </Card.Content>
//         </Card>

//         {/* Leaderboard Card */}
//         <Card style={[styles.card, { backgroundColor: colors.surface }]}>
//           <Card.Content>
//             <View style={styles.leaderboardHeader}>
//               <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
//                 Leaderboard
//               </Text>
//               <IconButton
//                 icon="trophy"
//                 mode="contained"
//                 containerColor={colors.primaryContainer}
//                 iconColor={colors.primary}
//                 size={20}
//               />
//             </View>

//             <SegmentedButtons
//               value={activeTab}
//               onValueChange={setActiveTab}
//               buttons={[
//                 { value: "global", label: "Global" },
//                 { value: "friends", label: "Friends" },
//               ]}
//               style={styles.segmentedButtons}
//             />
// {/*
//             <View style={styles.leaderboardList}>
//               {(activeTab === "global"
//                 ? globalLeaderboard
//                 : friendsLeaderboard
//               ).map((entry, index) => (
//                 <LeaderboardEntry
//                   key={entry.id}
//                   entry={entry}
//                   rank={index + 1}
//                 />
//               ))}
//             </View> */}
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsCardContent: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "25%",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  activityDate: {
    fontSize: 13,
    marginTop: 2,
  },
  activityScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  activityDivider: {
    marginVertical: 4,
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
    gap: 8,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 16,
    marginVertical: 16,
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
