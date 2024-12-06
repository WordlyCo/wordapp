import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { AuthContext } from "@/context/AuthContext";
import useTheme from "@/hooks/useTheme";

const LoginScreen: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (email && password) {
      const userToken = "dummy-auth-token";
      await login(userToken);
    } else {
      Alert.alert("Please enter email and password");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollViewContainer]}>
        <Text
          variant="headlineLarge"
          style={{
            textAlign: "center",
            fontWeight: "200",
          }}
        >
          Welcome to WordBird!
        </Text>
        <Image
          style={styles.image}
          source={require("@/assets/images/CandyCueDarkishBlue.png")}
          resizeMode="contain"
        />

        <Text
          variant="headlineLarge"
          style={{
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          {" "}
          Login
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Button icon="login" mode="contained" onPress={handleLogin}>
          Login
        </Button>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scrollViewContainer: {
    flexGrow: 1,
    gap: 15,
  },
  image: {
    width: "100%",
    height: 150, // Set a fixed height or adjust as needed
    marginVertical: 20,
  },
});
