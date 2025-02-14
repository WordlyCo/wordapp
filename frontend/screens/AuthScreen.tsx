import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { Text, Button, TextInput, SegmentedButtons } from "react-native-paper";
import { useStore } from "@/stores/store";
import useTheme from "@/hooks/useTheme";

type AuthMode = "login" | "register";

const AuthScreen: React.FC = () => {
  const login = useStore((state) => state.login);
  const register = useStore((state) => state.register);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { colors } = useTheme();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Required Fields", "Please fill in all required fields.");
      return;
    }

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          Alert.alert("Password Mismatch", "Passwords do not match.");
          return;
        }
        if (!username) {
          Alert.alert("Username Required", "Please enter a username.");
          return;
        }
        await register(email, password, username);
      }
    } catch (error) {
      Alert.alert(
        mode === "login" ? "Login Failed" : "Registration Failed",
        "Please check your information and try again."
      );
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome to WordBird!
        </Text>

        <Image
          style={styles.image}
          source={require("@/assets/images/CandyCueDarkishBlue.png")}
          resizeMode="contain"
        />

        <SegmentedButtons
          value={mode}
          onValueChange={(value) => {
            setMode(value as AuthMode);
            clearFields();
          }}
          buttons={[
            { value: "login", label: "Login" },
            { value: "register", label: "Register" },
          ]}
          style={styles.segmentedButtons}
        />

        <View style={styles.formContainer}>
          {mode === "register" && (
            <TextInput
              mode="outlined"
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
            />
          )}

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            style={styles.input}
          />

          {mode === "register" && (
            <TextInput
              mode="outlined"
              label="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              style={styles.input}
            />
          )}

          <Button
            icon={mode === "login" ? "login" : "account-plus"}
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scrollViewContainer: {
    flexGrow: 1,
    gap: 15,
  },
  title: {
    textAlign: "center",
    fontWeight: "200",
  },
  image: {
    width: "100%",
    height: 150,
    marginVertical: 20,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  formContainer: {
    gap: 12,
  },
  input: {
    width: "100%",
  },
  submitButton: {
    marginTop: 8,
  },
  buttonContent: {
    height: 48,
  },
});

export default AuthScreen;
