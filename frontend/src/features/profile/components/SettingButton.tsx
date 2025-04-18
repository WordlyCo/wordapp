import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const SettingButton = ({
  icon,
  title,
  titleColor,
  onPress,
  iconColor,
  onLongPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  titleColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  iconColor?: string;
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <View style={styles.settingIconContainer}>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={[styles.settingText, { color: titleColor }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  settingIconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
  },
});
