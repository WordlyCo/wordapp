import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import useTheme from "@/hooks/useTheme";
import StickyHeader from "@/components/StickyHeader";
import { SessionType, SESSION_TYPES } from "@/stores/enums";
import GameCard, { Game } from "@/components/GameCard";

type GameStackParamList = {
  MultipleChoice: undefined;
  SentenceSage: undefined;
};

type Props = {
  navigation: StackNavigationProp<GameStackParamList>;
};

const GAMES: Game[] = [
  {
    id: "1",
    title: "WordMaster Challenge",
    description: "Test your vocabulary with multiple-choice questions.",
    icon: "brain",
    type: SESSION_TYPES.MCQ,
  },
  {
    id: "2",
    title: "Sentence Sage",
    description: "Write sentences and get AI-checked feedback.",
    icon: "format-text",
    type: SESSION_TYPES.SS,
  },
];

const GamesTab = ({ navigation }: Props) => {
  const { colors } = useTheme();

  const handleGamePress = (type: SessionType) => {
    switch (type) {
      case SESSION_TYPES.MCQ:
        navigation.navigate("MultipleChoice");
        break;
      case SESSION_TYPES.SS:
        navigation.navigate("SentenceSage");
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
            Games Arena
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.onSurface }]}>
            Choose a game to sharpen your skills
          </Text>
        </View>

        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onPress={() => handleGamePress(game.type)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  scrollViewContainer: {
    padding: 15,
    gap: 15,
  },
});

export default GamesTab;
