import { View, StyleSheet, Image } from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { WordList } from "@/src/types/lists";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DIFFICULTY_LEVELS } from "@/src/stores/enums";

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

const getCategoryIcon = (
  category: string
): keyof typeof MaterialCommunityIcons.glyphMap => {
  const validIcons = Object.keys(MaterialCommunityIcons.glyphMap);
  if (validIcons.includes(category)) {
    return category as keyof typeof MaterialCommunityIcons.glyphMap;
  }

  return "book-open-page-variant";
};

export const WordListCard = ({
  list,
  onPress,
  shouldShowFavoriteButton = false,
  shouldShowAddToListButton = false,
  onFavoritePress,
  onAddToListPress,
}: {
  list: WordList;
  onPress: () => void;
  onFavoritePress?: () => void;
  shouldShowFavoriteButton?: boolean;
  shouldShowAddToListButton?: boolean;
  onAddToListPress?: () => void;
}) => {
  const { colors } = useAppTheme();
  const difficultyColor = getDifficultyColor(list.difficultyLevel, colors);

  const categoryIcon = getCategoryIcon(list.imageUrl || "");

  const renderButton = () => {
    if (shouldShowAddToListButton) {
      return (
        <IconButton
          icon={list.inUsersBank ? "check" : "plus"}
          iconColor={colors.onSurfaceVariant}
          onPress={onAddToListPress}
          size={20}
        />
      );
    }

    if (shouldShowFavoriteButton) {
      return (
        <IconButton
          icon={list.isFavorite ? "heart" : "heart-outline"}
          iconColor={colors.onSurfaceVariant}
          onPress={onFavoritePress}
          size={20}
        />
      );
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={list.name}
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
          <View
            style={[
              styles.textSection,
              !list.imageUrl && styles.fullWidthTextSection,
            ]}
          >
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
                  {list.difficultyLevel}
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
                  {list.categories?.join(", ")}
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
      <Card.Actions style={styles.cardActions}>{renderButton()}</Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 5,
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
  fullWidthTextSection: {
    flex: 1,
    paddingRight: 0,
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
