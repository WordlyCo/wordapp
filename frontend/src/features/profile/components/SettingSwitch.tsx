import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";

export const SettingSwitch = ({
  title,
  titleColor,
  value,
  onValueChange,
  icon,
  iconColor,
}: {
  title: string;
  titleColor?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingTextContainer}>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      <Text style={[styles.settingText, { color: titleColor }]}>{title}</Text>
    </View>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  settingIconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
  },
});
