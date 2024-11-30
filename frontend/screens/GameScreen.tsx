import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Text, Card, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2.2; // Adjust for margins

// Define the type for a game
type Game = {
  id: string;
  title: string;
  description: string;
  icon: string;
  elevation?: number; // Optional elevation
  type: string;
};

const GameScreen = () => {
  const { logout } = useContext(AuthContext);

  const games: Game[] = [
    {
      id: '3',
      title: 'WordMaster Challenge',
      description: 'Test your vocabulary with multiple-choice questions.',
      icon: 'brain',
      elevation: 2,
      type: 'game',
    },
    {
      id: '4',
      title: 'LinkWords',
      description: 'Connect related words in a fun association game.',
      icon: 'link',
      elevation: 3,
      type: 'game',
    },
    {
      id: '5',
      title: 'Sentence Sage',
      description: 'Write sentences and get AI-checked feedback.',
      icon: 'format-text',
      elevation: 1,
      type: 'game',
    },
  ];

  const handleCardPress = (game: Game) => {
    console.log(`Navigating to ${game.title}`);
    // Navigation logic to the game screen
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Games Arena</Text>
        <Text style={styles.headerSubtitle}>Choose a game to sharpen your skills</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {games.map((game) => (
          <TouchableOpacity key={game.id} onPress={() => handleCardPress(game)} activeOpacity={0.8}>
            <Card style={[styles.card, { elevation: game.elevation || 1 }]}>
              <Card.Title
                title={game.title}
                titleStyle={styles.cardTitle}
                titleNumberOfLines={2}
                left={(props) => <Avatar.Icon {...props} icon={game.icon} />}
              />
              <Card.Content>
                <Text variant="bodyMedium" numberOfLines={3} style={styles.cardDescription}>
                  {game.description}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => handleCardPress(game)}>
                  Play
                </Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button icon="logout" mode="contained" onPress={logout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  scrollViewContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    marginBottom: 15,
    height: 220,
    width: CARD_WIDTH,
    borderRadius: 8, // Rounded corners
    backgroundColor: '#f9f9f9', // Subtle background color
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
