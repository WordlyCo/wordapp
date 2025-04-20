import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useStore } from "@/src/stores/store";
import { APP_ERRORS_KEY } from "@/constants";

export default function DiagnosticsScreen() {
  const [errors, setErrors] = useState<any[]>([]);
  const [storageKeys, setStorageKeys] = useState<string[]>([]);
  const [storageInfo, setStorageInfo] = useState<{ [key: string]: string }>({});
  const [envVars, setEnvVars] = useState<{ [key: string]: string }>({});
  const store = useStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const errorsData = await AsyncStorage.getItem(APP_ERRORS_KEY);
      const parsedErrors = errorsData ? JSON.parse(errorsData) : [];
      setErrors(parsedErrors);

      const keys = await AsyncStorage.getAllKeys();
      setStorageKeys([...keys]);

      setEnvVars({
        API_URL: process.env.EXPO_PUBLIC_API_URL || "Not set",
        CLERK_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
          ? `${process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(
              0,
              8
            )}...`
          : "Not set",
      });
    } catch (e) {
      console.error("Failed to load diagnostic data:", e);
    }
  };

  const inspectStorageItem = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      setStorageInfo({
        ...storageInfo,
        [key]: value || "Empty value",
      });
    } catch (e) {
      setStorageInfo({
        ...storageInfo,
        [key]: `Error reading: ${e}`,
      });
    }
  };

  const clearErrors = async () => {
    try {
      await AsyncStorage.removeItem(APP_ERRORS_KEY);
      setErrors([]);
      Alert.alert("Success", "Error logs cleared");
    } catch (e) {
      Alert.alert("Error", `Failed to clear error logs: ${e}`);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Diagnostics</Text>
        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environment</Text>
        {Object.entries(envVars).map(([key, value]) => (
          <View key={key} style={styles.item}>
            <Text style={styles.itemKey}>{key}</Text>
            <Text style={styles.itemValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication State</Text>
        <View style={styles.item}>
          <Text style={styles.itemKey}>Is Authenticated</Text>
          <Text style={styles.itemValue}>
            {store.isAuthenticated ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemKey}>Has Onboarded</Text>
          <Text style={styles.itemValue}>
            {store.hasOnboarded ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Error Logs ({errors.length})</Text>
          <TouchableOpacity style={styles.smallButton} onPress={clearErrors}>
            <Text style={styles.smallButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        {errors.length === 0 ? (
          <Text style={styles.infoText}>No errors recorded</Text>
        ) : (
          errors.map((error, index) => (
            <View key={index} style={styles.errorItem}>
              <Text style={styles.timestamp}>{error.timestamp}</Text>
              <Text style={styles.errorMessage}>{error.message}</Text>
              <Text style={styles.errorStack} numberOfLines={3}>
                {error.stack?.substring(0, 150) || "No stack trace"}...
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Keys</Text>
        {storageKeys.map((key) => (
          <View key={key}>
            <TouchableOpacity
              style={styles.keyItem}
              onPress={() => inspectStorageItem(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
            {storageInfo[key] && (
              <Text style={styles.storageInfo} numberOfLines={5}>
                {typeof storageInfo[key] === "string" &&
                storageInfo[key].length > 200
                  ? `${storageInfo[key].substring(0, 200)}...`
                  : storageInfo[key]}
              </Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.divider} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#6460CD",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  smallButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  smallButtonText: {
    color: "white",
    fontSize: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemKey: {
    color: "#666",
    flex: 1,
  },
  itemValue: {
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  errorItem: {
    backgroundColor: "#fff8f8",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
  },
  timestamp: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  errorMessage: {
    color: "#d32f2f",
    fontWeight: "bold",
    marginBottom: 4,
  },
  errorStack: {
    color: "#666",
    fontSize: 12,
    fontFamily: "monospace",
  },
  keyItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  keyText: {
    color: "#333",
  },
  storageInfo: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  infoText: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },
});
