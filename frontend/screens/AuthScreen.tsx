import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  Button,
  TextInput,
  SegmentedButtons,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "@/stores/store";
import useTheme from "@/hooks/useTheme";

type AuthMode = "login" | "register";

const AuthScreen: React.FC = () => {
  const login = useStore((state) => state.login);
  const register = useStore((state) => state.register);
  const setAuthError = useStore((state) => state.setAuthError);
  const authError = useStore((state) => state.authError);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setAuthError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setAuthError(
        "Password must be at least 8 characters long and contain at least one uppercase letter."
      );
      return;
    }
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!confirmPassword) {
          setAuthError("Please confirm your password.");
          return;
        }

        if (password !== confirmPassword) {
          setAuthError("Passwords do not match.");
          return;
        }

        if (!username) {
          setAuthError("Please enter a username.");
          return;
        }
        await register(email, password, username);
      }
    } catch (error) {
      setAuthError(
        mode === "login"
          ? "Login Failed: " + error
          : "Registration Failed: " + error
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome to WordBird!
          </Text>

          <Image
            style={styles.image}
            source={require("@/assets/images/CandyCueDarkishBlue.png")}
            resizeMode="contain"
          />
        </View>

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

        {authError && (
          <View style={styles.errorContainer}>
            <Text variant="bodyMedium" style={styles.errorText}>
              {authError}
            </Text>
            <IconButton
              icon="close"
              size={20}
              onPress={() => setAuthError("")}
            />
          </View>
        )}

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
    </SafeAreaView>
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
  headerContainer: {
    alignItems: "center",
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
  errorText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgb(255 13 93)",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});

export default AuthScreen;
