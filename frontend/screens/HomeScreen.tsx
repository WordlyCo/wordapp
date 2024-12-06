import React, { useContext, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Avatar, Text, Button, Card, Divider } from "react-native-paper";
import { AuthContext } from "@/context/AuthContext";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["EXPO_PUBLIC_OPENAPI_KEY"], // This is the default and can be omitted
});

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="calendar" />;

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);
  const [result, setResult] = React.useState("");

  // useEffect(() => {
  //   const callAPI = async () => {
  //     const chatCompletion = await client.chat.completions.create({
  //       messages: [{ role: "user", content: "How to start a repo?" }],
  //       model: "gpt-4o",
  //       max_completion_tokens: 50
  //     });
  //     setResult(chatCompletion.choices);
  //   };
  //   callAPI();
  // }, []);

  // console.log("CHATGPT MESSAGE: ", result);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Card elevation={2}>
          <Card.Title
            title="Today's Learning Goals"
            titleStyle={{ fontSize: 24 }}
            left={LeftContent}
          ></Card.Title>
          <Card.Content>
            <Text variant="bodyLarge">
              Master 5 new words and complete the flashcard challenge!
            </Text>
          </Card.Content>
        </Card>

        <Card elevation={1}>
          <Card.Title
            title="Motivation for You"
            titleStyle={{ fontSize: 24 }}
            left={(props: any) => <Avatar.Icon {...props} icon="rocket" />}
          ></Card.Title>
          <Card.Content>
            <Text variant="bodyLarge">
              "The more you learn, the more places you'll go." - Dr. Seuss
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingVertical: 15,
    marginHorizontal: 15,
    gap: 15,
  },
});
