import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

type OptionButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  showAnswer: boolean;
  colors: any;
  children: string;
};

const OptionButton = ({
  onPress,
  disabled,
  isSelected,
  isCorrect,
  showAnswer,
  colors,
  children,
}: OptionButtonProps) => {
  const getBackgroundColor = () => {
    if (showAnswer && isCorrect) return colors.progress + "20";
    return colors.surface;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Card
        style={[
          styles.optionButton,
          {
            backgroundColor: getBackgroundColor(),
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? colors.primary : "transparent",
          },
        ]}
        elevation={2}
      >
        <Card.Content style={styles.optionContent}>
          <Text style={[styles.optionText, { color: colors.onSurface }]}>
            {children}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  optionButton: {
    borderRadius: 8,
    minHeight: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionContent: {
    padding: 12,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    flexWrap: "wrap",
  },
});

export default OptionButton;
