import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, Button, TextInput, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { useAuthNavigation } from "@/src/features/auth/navigation";
import { CustomSnackbar } from "@/src/components/CustomSnackbar";

const googleLogo = require("@/assets/logos/google.png");

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { goToRegister } = useAuthNavigation();
  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: isSignInLoaded,
  } = useSignIn();

  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const { colors } = useAppTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!isSignInLoaded) return;

    if (!email || !password) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setSignInActive({ session: signInAttempt.createdSessionId });
        setSnackbarMessage("Welcome back!");
        setSnackbarType("success");
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage("Please try again.");
        setSnackbarType("error");
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : String(error)
      );
      setSnackbarType("error");
      setSnackbarVisible(true);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      const result = await startSSOFlow({
        strategy: `oauth_${provider}`,
      });

      if (result && result.createdSessionId) {
        await result.setActive?.({ session: result.createdSessionId });
        setSnackbarMessage("Welcome back!");
        setSnackbarType("success");
        setSnackbarVisible(true);
      } else if (result.signUp) {
        try {
          const emailUsername =
            result.signUp.emailAddress?.split("@")[0] || `user_${Date.now()}`;

          const completeSignUp = await result.signUp.update({
            username: emailUsername,
          });

          if (completeSignUp.status === "complete") {
            await result.setActive?.({
              session: result.signUp.createdSessionId,
            });
            setSnackbarMessage("Welcome! Your account has been created.");
            setSnackbarType("success");
            setSnackbarVisible(true);
          } else {
            setSnackbarMessage(
              "Additional steps are required to complete sign-up."
            );
            setSnackbarType("error");
            setSnackbarVisible(true);
          }
        } catch (error) {
          setSnackbarMessage(
            error instanceof Error ? error.message : String(error)
          );
          setSnackbarType("error");
          setSnackbarVisible(true);
        }
      } else {
        setSnackbarMessage(
          `${
            provider.charAt(0).toUpperCase() + provider.slice(1)
          } Sign-in Incomplete`
        );
        setSnackbarType("error");
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : String(error)
      );
      setSnackbarType("error");
      setSnackbarVisible(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.headerContainer}>
            <Text variant="headlineLarge" style={styles.title}>
              Sign In
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sign in to continue your learning journey
            </Text>
          </View>

          <View style={styles.formContainer}>
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
              secureTextEntry={hiddenPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() => setHiddenPassword(!hiddenPassword)}
                />
              }
            />

            <Button
              icon="login"
              mode="contained"
              onPress={handleLogin}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <Divider style={styles.divider} />
            </View>

            <Button
              icon={() => (
                <Image source={googleLogo} style={styles.googleIcon} />
              )}
              mode="outlined"
              onPress={() => handleOAuthSignIn("google")}
              style={[styles.socialButton, styles.googleButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.googleText}
            >
              Continue with Google
            </Button>

            <Button
              icon="apple"
              mode="outlined"
              onPress={() => handleOAuthSignIn("apple")}
              style={[styles.socialButton, styles.appleButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.appleText}
              theme={{ colors: { outline: "transparent" } }}
            >
              Continue with Apple
            </Button>

            <View style={styles.signupContainer}>
              <Text variant="bodyMedium">Don't have an account?</Text>
              <Button mode="text" onPress={goToRegister}>
                Sign Up
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    gap: 15,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  headerContainer: { alignItems: "center" },
  title: { textAlign: "center", fontWeight: "200" },
  subtitle: { textAlign: "center", marginTop: 8 },
  formContainer: { gap: 12 },
  input: { width: "100%" },
  submitButton: { marginTop: 8 },
  socialButton: { marginTop: 8 },
  googleButton: {
    backgroundColor: "white",
    borderColor: "#dadce0",
    borderWidth: 1,
  },
  googleText: { color: "#3c4043", fontWeight: "500" },
  appleButton: { backgroundColor: "black", borderWidth: 0 },
  appleText: { color: "white", fontWeight: "500" },
  buttonContent: { height: 48 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 8, fontSize: 14 },
  googleIcon: { width: 20, height: 20 },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
