import { View, Text, StyleSheet } from "react-native";

export const SettingSection = ({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContainer,
          { backgroundColor: colors.surfaceVariant },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionContainer: {
    borderRadius: 12,
    marginBottom: 16,
  },
});
