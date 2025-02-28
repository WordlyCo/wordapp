import { StyleSheet, View } from "react-native";

import { Button, Avatar, Text } from "react-native-paper";
import useTheme from "@/hooks/useTheme";
import { WordCategory } from "@/stores/types";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

const CategoryItem = ({
  item,
  onPress,
}: {
  item: WordCategory;
  onPress: () => void;
}) => {
  const { colors } = useTheme();

  // Get the category-specific color from the theme
  const getCategoryColor = () => {
    if (item.name.toLowerCase() in colors.categories) {
      return colors.categories[
        item.name.toLowerCase() as keyof typeof colors.categories
      ];
    }
    return colors.primary;
  };

  return (
    <Button
      style={[styles.categoryButton, { backgroundColor: colors.surface }]}
      mode="elevated"
      onPress={onPress}
      contentStyle={{
        paddingVertical: 12,
      }}
    >
      <View style={styles.categoryContent}>
        <Avatar.Icon
          size={25}
          icon={item.icon as IconSource}
          style={[
            styles.categoryIcon,
            {
              backgroundColor: getCategoryColor(),
            },
          ]}
          color={colors.onSurface}
        />
        <Text variant="bodyLarge" style={styles.categoryLabel}>
          {item.name}
        </Text>
      </View>
    </Button>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  categoryButton: {
    width: "47%",
    marginHorizontal: "1.5%",
    marginVertical: 8,
    borderRadius: 12,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  categoryIcon: {
    marginBottom: 0,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
