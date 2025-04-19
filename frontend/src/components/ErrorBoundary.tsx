import React, { Component, ErrorInfo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_ERRORS_KEY, APP_STORAGE_KEY } from "@/constants";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.logErrorToStorage(error, errorInfo);
  }

  logErrorToStorage = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const existingErrorsString = await AsyncStorage.getItem(APP_ERRORS_KEY);
      const existingErrors = existingErrorsString
        ? JSON.parse(existingErrorsString)
        : [];

      const newError = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };

      // only last 10 errors to prevent storage issues
      const updatedErrors = [newError, ...existingErrors].slice(0, 10);
      await AsyncStorage.setItem(APP_ERRORS_KEY, JSON.stringify(updatedErrors));
    } catch (e) {
      console.error("Failed to log error to storage:", e);
    }
  };

  resetError = async () => {
    this.setState({ hasError: false, error: null });
  };

  clearApp = async () => {
    try {
      // do not error logs
      await AsyncStorage.removeItem(APP_STORAGE_KEY);
      this.setState({ hasError: false, error: null });
    } catch (e) {
      console.error("Failed to clear app data:", e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.resetError}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={this.clearApp}
            >
              <Text style={styles.buttonText}>Reset App</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#6460CD",
    marginHorizontal: 8,
  },
  dangerButton: {
    backgroundColor: "#ff6b6b",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ErrorBoundary;
