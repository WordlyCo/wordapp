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
import useTheme from "@/src/hooks/useTheme";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

type AuthMode = "login" | "register";

export default function AuthScreen() {
  const router = useRouter();
  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: isSignInLoaded,
  } = useSignIn();
  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: isSignUpLoaded,
  } = useSignUp();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    if (!isSignInLoaded) return;

    if (!email || !password) {
      setAuthError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setSignInActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        setAuthError("Sign-in failed. Please try again.");
      }
    } catch (error) {
      setAuthError(
        "Login Failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleRegister = async () => {
    if (!isSignUpLoaded) return;

    if (!email || !password || !username) {
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

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (error) {
      setAuthError(
        "Registration Failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleVerification = async () => {
    if (!isSignUpLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (signUpAttempt.status === "complete") {
        await setSignUpActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(auth)/onboarding");
      } else {
        setAuthError("Verification failed. Please try again.");
      }
    } catch (error) {
      setAuthError(
        "Verification Failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleSubmit = async () => {
    if (mode === "login") {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setVerificationCode("");
    setPendingVerification(false);
    setAuthError(null);
  };

  if (pendingVerification) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.headerContainer}>
            <Text variant="headlineLarge" style={styles.title}>
              Verify Your Email
            </Text>
            <Text
              variant="bodyMedium"
              style={{ textAlign: "center", marginTop: 10 }}
            >
              Please enter the verification code sent to your email
            </Text>

            <Image
              style={styles.image}
              source={require("@/assets/images/CandyCueDarkishBlue.png")}
              resizeMode="contain"
            />
          </View>

          {authError && (
            <View style={styles.errorContainer}>
              <Text variant="bodyMedium" style={styles.errorText}>
                {authError}
              </Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => setAuthError(null)}
              />
            </View>
          )}

          <View style={styles.formContainer}>
            <TextInput
              mode="outlined"
              label="Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              style={styles.input}
            />

            <Button
              icon="check"
              mode="contained"
              onPress={handleVerification}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
            >
              Verify Email
            </Button>

            <Button
              mode="text"
              onPress={() => setPendingVerification(false)}
              style={{ marginTop: 10 }}
            >
              Back to Sign Up
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
              onPress={() => setAuthError(null)}
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
}

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
