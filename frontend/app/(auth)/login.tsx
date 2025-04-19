import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "@/src/hooks/useTheme";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { useAuthNavigation } from "@/src/features/auth/navigation";

const googleLogo = require("@/assets/logos/google.png");

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { goToRegister } = useAuthNavigation();
  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: isSignInLoaded,
  } = useSignIn();

  // Initialize SSO flow hook (no args)
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      setAuthError(null);
      // start SSO flow for chosen strategy
      const result = await startSSOFlow({
        strategy: `oauth_${provider}`,
      });

      if (result && result.createdSessionId) {
        await result.setActive?.({ session: result.createdSessionId });
      } else {
        setAuthError(
          `${
            provider.charAt(0).toUpperCase() + provider.slice(1)
          } sign-in incomplete`
        );
      }
    } catch (error) {
      setAuthError(
        `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } sign-in failed: ` +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            Sign In
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Sign in to continue your learning journey
          </Text>
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
            right={<TextInput.Icon icon="eye" />}
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
            icon={() => <Image source={googleLogo} style={styles.googleIcon} />}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  scrollViewContainer: { flexGrow: 1, gap: 15 },
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
  errorText: { textAlign: "center", fontWeight: "bold", fontSize: 16 },
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
