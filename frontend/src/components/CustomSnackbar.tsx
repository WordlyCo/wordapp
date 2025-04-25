import React from "react";
import { StyleSheet } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { useAppTheme } from "@/src/contexts/ThemeContext";

interface CustomSnackbarProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onDismiss: () => void;
  duration?: number;
}

export const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  visible,
  message,
  type = "info",
  onDismiss,
  duration = 3000,
}) => {
  const { colors } = useAppTheme();

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          background: colors.success,
          text: colors.onPrimary,
          action: colors.onPrimary,
        };
      case "error":
        return {
          background: colors.error,
          text: colors.onError,
          action: colors.onError,
        };
      case "warning":
        return {
          background: colors.warning,
          text: colors.onPrimary,
          action: colors.onPrimary,
        };
      default:
        return {
          background: colors.info,
          text: colors.onPrimary,
          action: colors.onPrimary,
        };
    }
  };

  const snackbarColors = getColors();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={{
        label: "Dismiss",
        onPress: onDismiss,
        textColor: snackbarColors.action,
      }}
      style={[styles.snackbar, { backgroundColor: snackbarColors.background }]}
      theme={{
        colors: {
          surface: snackbarColors.background,
          onSurface: snackbarColors.text,
        },
      }}
    >
      <Text style={[styles.message, { color: snackbarColors.text }]}>
        {message}
      </Text>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
  },
});
