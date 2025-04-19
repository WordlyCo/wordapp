import * as WebBrowser from "expo-web-browser";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";
import { useAuthNavigation } from "@/src/features/auth/navigation";

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const { goToLogin } = useAuthNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Welcome to Word App
        </Text>

        <Text variant="bodyLarge" style={styles.subtitle}>
          Learn new words. Track your progress. Become a vocabulary master.
        </Text>

        <Image
          style={styles.image}
          source={require("@/assets/images/CandyCueDarkishBlue.png")}
          resizeMode="contain"
        />

        <Text variant="bodyMedium" style={styles.description}>
          Join thousands of learners expanding their vocabulary every day with
          fun, bite-sized exercises.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={goToLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Get Started
          </Button>

          <View style={styles.loginContainer}>
            <Text variant="bodyMedium">Already have an account?</Text>
            <Button mode="text" onPress={goToLogin}>
              Log in
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "200",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 180,
    marginVertical: 20,
  },
  description: {
    textAlign: "center",
    marginHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
    marginTop: 20,
  },
  button: {
    width: "100%",
  },
  buttonContent: {
    height: 50,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
