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
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useAuthNavigation } from "@/src/features/auth/navigation";

WebBrowser.maybeCompleteAuthSession();

const googleLogo = require("@/assets/logos/google.png");

export default function RegisterScreen() {
  const { goToLogin, goToOnboarding } = useAuthNavigation();
  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: isSignUpLoaded,
  } = useSignUp();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

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
        goToOnboarding();
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

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      setAuthError(null);
      const startOAuth = provider === "google" ? googleAuth : appleAuth;

      if (!startOAuth) {
        setAuthError(
          `${
            provider.charAt(0).toUpperCase() + provider.slice(1)
          } sign-in is not available`
        );
        return;
      }

      const result = await startOAuth();

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

  if (pendingVerification) {
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
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Join Word App and start your learning journey
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
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />

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

          <TextInput
            mode="outlined"
            label="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            style={styles.input}
            right={<TextInput.Icon icon="eye" />}
          />

          <Button
            icon="account-plus"
            mode="contained"
            onPress={handleRegister}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            Create Account
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

          <View style={styles.loginContainer}>
            <Text variant="bodyMedium">Already have an account?</Text>
            <Button mode="text" onPress={goToLogin}>
              Log in
            </Button>
          </View>
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
  subtitle: {
    textAlign: "center",
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: 150,
    marginVertical: 20,
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
  socialButton: {
    marginTop: 8,
  },
  googleButton: {
    backgroundColor: "white",
    borderColor: "#dadce0",
    borderWidth: 1,
  },
  googleText: {
    color: "#3c4043",
    fontWeight: "500",
  },
  appleButton: {
    backgroundColor: "black",
    borderWidth: 0,
  },
  appleText: {
    color: "white",
    fontWeight: "500",
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
