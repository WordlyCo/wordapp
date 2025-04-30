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
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { useAuthNavigation } from "@/src/features/auth/navigation";
import { CustomSnackbar } from "@/src/components/CustomSnackbar";

WebBrowser.maybeCompleteAuthSession();

const googleLogo = require("@/assets/logos/google.png");

export default function RegisterScreen() {
  const { goToLogin, goToOnboarding } = useAuthNavigation();
  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: isSignUpLoaded,
  } = useSignUp();

  // Initialize SSO flow hook
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
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

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!isSignUpLoaded) return;

    if (!email || !password || !username) {
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

    if (!validatePassword(password)) {
      setSnackbarMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter."
      );
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarType("error");
      setSnackbarVisible(true);
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
      setSnackbarMessage("Please verify your email address");
      setSnackbarType("success");
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : String(error)
      );
      setSnackbarType("error");
      setSnackbarVisible(true);
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
        setSnackbarMessage("Your account is now verified");
        setSnackbarType("success");
        setSnackbarVisible(true);
        goToOnboarding();
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
        setSnackbarMessage("Welcome!");
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
            goToOnboarding();
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

  if (pendingVerification) {
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
                source={require("@/assets/images/icon.png")}
                resizeMode="contain"
              />
            </View>

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
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
              Create Account
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Join Word App and start your learning journey
            </Text>
          </View>

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

            <TextInput
              mode="outlined"
              label="Confirm Password"
              secureTextEntry={hiddenConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() =>
                    setHiddenConfirmPassword(!hiddenConfirmPassword)
                  }
                />
              }
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

            {/* <Button
              icon="apple"
              mode="outlined"
              onPress={() => handleOAuthSignIn("apple")}
              style={[styles.socialButton, styles.appleButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.appleText}
              theme={{ colors: { outline: "transparent" } }}
            >
              Continue with Apple
            </Button> */}

            <View style={styles.loginContainer}>
              <Text variant="bodyMedium">Already have an account?</Text>
              <Button mode="text" onPress={goToLogin}>
                Log in
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
