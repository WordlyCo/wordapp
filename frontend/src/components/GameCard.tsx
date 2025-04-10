import { Button } from "react-native-paper";
import { Avatar } from "react-native-paper";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Text } from "react-native-paper";
import { SessionType } from "@/stores/enums";

export type Game = {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: SessionType;
};

const GameCard = ({ game, onPress }: { game: Game; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card style={styles.card}>
      <Card.Title
        title={game.title}
        titleStyle={styles.cardTitle}
        left={() => <Avatar.Icon size={40} icon={game.icon} />}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.cardDescription}>
          {game.description}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.cardButton}>
        <Button mode="contained" onPress={onPress}>
          Play
        </Button>
      </Card.Actions>
    </Card>
  </TouchableOpacity>
);

export default GameCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 8,
  },
  cardButton: {
    marginVertical: 8,
    justifyContent: "flex-end",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
});
