import React, { useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Avatar, Text, Card, Button } from "react-native-paper";
import useTheme from "@/hooks/useTheme";
import { AuthContext } from "@/context/AuthContext";
import StickyHeader from "@/components/StickyHeader";

const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 45) / 2.2; // Adjust for margins

// Define the type for a game
type Game = {
  id: string;
  title: string;
  description: string;
  icon: string;
  elevation?: number; // Optional elevation
  type: string;
};

const GameScreen = ({ navigation }: any) => {
  const { logout } = useContext(AuthContext);
  const { colors } = useTheme();

  const games: Game[] = [
    {
      id: "3",
      title: "WordMaster Challenge",
      description: "Test your vocabulary with multiple-choice questions.",
      icon: "brain",
      elevation: 2,
      type: "multipleChoice",
    },
    {
      id: "4",
      title: "LinkWords",
      description: "Connect related words in a fun association game.",
      icon: "link",
      elevation: 3,
      type: "game",
    },
    {
      id: "5",
      title: "Sentence Sage",
      description: "Write sentences and get AI-checked feedback.",
      icon: "format-text",
      elevation: 1,
      type: "sentenceSage",
    },
  ];

  const handleCardPress = (type: string) => {
    if (type === "") {
      console.log("Provide a valid game screen type");
      return;
    }
    if (type === "multipleChoice") {
      navigation.navigate("MultipleChoice");
    } else if (type === "sentenceSage") {
      navigation.navigate("SentenceSage");
    }
  };

  return (
    <>
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

          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              onPress={() => {
                handleCardPress(game.type);
              }}
              activeOpacity={0.8}
            >
              <Card style={[styles.card, { elevation: game.elevation || 1 }]}>
                <Card.Title
                  title={game.title}
                  titleStyle={styles.cardTitle}
                  titleNumberOfLines={2}
                  left={(props) => <Avatar.Icon {...props} icon={game.icon} />}
                />
                <Card.Content>
                  <Text
                    variant="bodyMedium"
                    numberOfLines={3}
                    style={styles.cardDescription}
                  >
                    {game.description}
                  </Text>
                </Card.Content>
                <Card.Actions style={styles.cardButton}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleCardPress(game.type);
                    }}
                  >
                    Play
                  </Button>
                </Card.Actions>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default GameScreen;

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
    color: "#222",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  scrollViewContainer: {
    paddingVertical: 15,
    marginHorizontal: 15,
    gap: 15,
  },
  card: {
    borderRadius: 8,
  },
  cardButton: {
    marginVertical: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 5,
  },
});
