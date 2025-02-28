import React, { useState } from "react";
import { Text, Card, Button, Searchbar } from "react-native-paper";
import StickyHeader from "@/components/StickyHeader";
import { FlashList } from "@shopify/flash-list";
import { Image, StyleSheet, View, Pressable } from "react-native";
import useTheme, { ColorType } from "@/hooks/useTheme";
import { wordLists } from "@/stores/mockData";
import { WordList } from "@/stores/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DIFFICULTY_LEVELS } from "@/stores/enums";

const Header = ({ colors }: { colors: ColorType }) => {
  return (
    <View style={styles.headingContainer}>
      <Text
        style={[
          styles.heading,
          { color: colors.onSurface, borderColor: colors.primary },
        ]}
      >
        Word Lists
      </Text>
    </View>
  );
};

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

const getDifficultyColor = (difficulty: string, colors: ColorType) => {
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

const MetadataItem = ({
  icon,
  color,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  text: string;
}) => (
  <View style={styles.metadataItem}>
    <MaterialCommunityIcons name={icon} size={16} color={color} />
    <Text style={[styles.metadataText, { color }]}>{text}</Text>
  </View>
);

const CategoryList = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter word lists based on search query
  const filteredLists = wordLists.filter(
    (list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: WordList }) => {
    const difficultyColor = getDifficultyColor(item.difficulty, colors);
    const categoryIcon = getCategoryIcon(item.category);

    const handleCardPress = () => {
      console.log("View details for:", item.title);
    };

    return (
      <Card style={styles.card} mode="elevated" onPress={handleCardPress}>
        <Card.Title
          titleStyle={[styles.cardTitle, { color: colors.onSurface }]}
          title={item.title}
          left={(props) => (
            <MaterialCommunityIcons
              name={categoryIcon}
              size={24}
              color={colors.primary}
            />
          )}
        />
        <Card.Content>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text
                style={[styles.description, { color: colors.onSurfaceVariant }]}
              >
                {item.description}
              </Text>

              <View
                style={[
                  styles.metadataContainer,
                  {
                    borderTopWidth: 0.5,
                    borderBottomWidth: 0.5,
                    borderTopColor: colors.outline,
                    borderBottomColor: colors.outline,
                  },
                ]}
              >
                <MetadataItem
                  icon="stairs"
                  color={difficultyColor}
                  text={item.difficulty.toLowerCase()}
                />
                <MetadataItem
                  icon="book-open-page-variant"
                  color={colors.secondary}
                  text={`${item.wordCount} words`}
                />
                <MetadataItem
                  icon="tag"
                  color={colors.primary}
                  text={item.category}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => console.log("Add to list")}
                  style={styles.button}
                  buttonColor={colors.primary}
                  rippleColor="rgba(255, 255, 255, 0.2)"
                >
                  Add
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => console.log("View details")}
                  textColor={colors.onSurface}
                  style={[styles.button, { borderColor: colors.outline }]}
                  rippleColor="rgba(0, 0, 0, 0.1)"
                >
                  Details
                </Button>
              </View>
            </View>
            <View style={styles.imageContainer}>
              {item.imageUrl && (
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{
                    uri: item.imageUrl,
                  }}
                />
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />

      <FlashList
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <Searchbar
                placeholder="Search word lists..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={[styles.searchBar, { borderColor: colors.outline }]}
              />
            </View>
            <Header colors={colors} />
          </>
        }
        renderItem={renderItem}
        data={filteredLists}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBar: {
    marginBottom: 15,
    elevation: 0,
    borderWidth: 1,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headingContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 15,
    marginTop: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 2,
    paddingRight: 12,
    justifyContent: "space-between",
  },
  description: {
    marginBottom: 12,
    fontSize: 14,
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingVertical: 8,
    marginBottom: 12,
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  button: {
    marginRight: 8,
    marginBottom: 4,
    flex: 1,
    borderRadius: 8,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
});
