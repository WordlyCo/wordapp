import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, Card, Button, Searchbar } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import StickyHeader from "@/src/components/StickyHeader";
import useTheme, { ColorType } from "@/src/hooks/useTheme";
import { WordListCategory } from "@/types/lists";
import { DIFFICULTY_LEVELS } from "@/types/enums";
import { useStore } from "@/stores/store";
import { HomeStackParamList, HomeScreenNavigationProp } from "./StoreTab";

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

const WordLists = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    selectedListsByCategory,
    isFetchingListsByCategory,
    fetchListsByCategory,
  } = useStore();
  const route = useRoute();
  const { categoryId } = route.params as { categoryId: string };

  console.log("categoryId", categoryId);

  useEffect(() => {
    fetchListsByCategory(categoryId || "");
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderItem = ({ item }: { item: WordListCategory }) => {
    const difficultyColor = getDifficultyColor(item.difficultyLevel, colors);
    const categoryIcon = getCategoryIcon(item.iconUrl || "");

    const handleCardPress = () => {
      navigation.navigate("ListDetails", {
        listId: item.id as string,
      });
    };

    return (
      <Card style={styles.card} mode="elevated" onPress={handleCardPress}>
        <Card.Title
          titleStyle={[styles.cardTitle, { color: colors.onSurface }]}
          title={item.name}
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
            <View
              style={[
                styles.textContainer,
                !item.iconUrl && styles.fullWidthTextContainer,
              ]}
            >
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
                {/* <MetadataItem
                  icon="stairs"
                  color={difficultyColor}
                  text={item.difficultyLevel.toLowerCase()}
                />
                <MetadataItem
                  icon="book-open-page-variant"
                  color={colors.secondary}
                    text={`${item.words.length} words`}
                />
                <MetadataItem
                  icon="tag"
                  color={colors.primary}
                  text={item.name}
                /> */}
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
            {item.iconUrl && (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{
                    uri: item.iconUrl,
                  }}
                />
              </View>
            )}
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
                onChangeText={handleSearch}
                value={searchQuery}
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                  },
                ]}
                elevation={0}
                icon={() => (
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color={colors.onSurfaceVariant}
                  />
                )}
                clearIcon={() =>
                  searchQuery ? (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
            <Header colors={colors} />
          </>
        }
        renderItem={renderItem}
        data={selectedListsByCategory as WordListCategory[]}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default WordLists;

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
    borderRadius: 12,
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
  fullWidthTextContainer: {
    flex: 1,
    paddingRight: 0,
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
