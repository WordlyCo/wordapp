import { View, StyleSheet, Image } from "react-native";
import { Text, Card, IconButton, Chip } from "react-native-paper";
import useTheme from "@/hooks/useTheme";
import { WordList } from "@/stores/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DIFFICULTY_LEVELS } from "@/stores/enums";

// Helper function to get appropriate icon for category
const getCategoryIcon = (
  category: string
): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (category.toLowerCase()) {
    case "education":
      return "school";
    case "business":
      return "briefcase";
    case "medical":
      return "medical-bag";
    case "technology":
      return "laptop";
    case "literature":
      return "book-open-page-variant";
    case "legal":
      return "scale-balance";
    case "general":
      return "comment-text-outline";
    case "academic":
      return "school";
    case "creative":
      return "brush";
    default:
      return "book-open-variant";
  }
};

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string, colors: any) => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return colors.difficulty.beginner;
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return colors.difficulty.intermediate;
    case DIFFICULTY_LEVELS.ADVANCED:
      return colors.difficulty.advanced;
    default:
      return colors.difficulty.default;
  }
};

export const WordListCard = ({
  list,
  onPress,
}: {
  list: WordList;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const categoryIcon = getCategoryIcon(list.category);
  const difficultyColor = getDifficultyColor(list.difficulty, colors);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={list.title}
        titleStyle={styles.cardTitle}
        left={(props) => (
          <MaterialCommunityIcons
            name={categoryIcon}
            size={24}
            color={colors.primary}
          />
        )}
      />
      <Card.Content>
        <View style={styles.contentLayout}>
          <View style={styles.textSection}>
            <Text
              variant="bodyMedium"
              style={[styles.description, { color: colors.onSurfaceVariant }]}
            >
              {list.description}
            </Text>

            {/* Metadata row */}
            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                <MaterialCommunityIcons
                  name="stairs"
                  size={16}
                  color={difficultyColor}
                />
                <Text style={[styles.metadataText, { color: difficultyColor }]}>
                  {list.difficulty.toLowerCase()}
                </Text>
              </View>

              <View style={styles.metadataItem}>
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  size={16}
                  color={colors.secondary}
                />
                <Text
                  style={[styles.metadataText, { color: colors.secondary }]}
                >
                  {list.wordCount} words
                </Text>
              </View>

              <View style={styles.metadataItem}>
                <MaterialCommunityIcons
                  name="tag"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.metadataText, { color: colors.primary }]}>
                  {list.category}
                </Text>
              </View>
            </View>
          </View>

          {list.imageUrl && (
            <View style={styles.imageSection}>
              <Image
                source={{ uri: list.imageUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <IconButton
          icon="dots-vertical"
          iconColor={colors.onSurfaceVariant}
          onPress={() => console.log("More options")}
          size={20}
        />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 5,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    marginBottom: 12,
    fontSize: 14,
  },
  contentLayout: {
    flexDirection: "row",
  },
  textSection: {
    flex: 3,
    paddingRight: 12,
  },
  imageSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingTop: 0,
  },
});
