import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Text, Card, TextInput, Button, Snackbar } from "react-native-paper";
import useTheme from "@/hooks/useTheme";
import OpenAI from "openai";

type Word = {
  word: string;
  correct: string;
  options: string[];
};

type OpenAIResponseType = {
  isCorrect: boolean;
  correctUsage?: string;
  message: string;
};

const client = new OpenAI({
  apiKey: process.env["EXPO_PUBLIC_OPENAPI_KEY"],
});

function cleanJsonResponse(jsonString: any) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    try {
      let cleaned = jsonString.replace(/\\n/g, "\n");
      cleaned = cleaned.replace(/\\"/g, '"');
      cleaned = cleaned.replace(/\\/g, "");
      return JSON.parse(cleaned);
    } catch (error: any) {
      throw new Error("Failed to parse JSON: " + error.message);
    }
  }
}

const SentenceSage = () => {
  const { colors } = useTheme();
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [sentence, setSentence] = useState<string>("");
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [openAIResponse, setOpenAIResponse] = useState<OpenAIResponseType>();

  const handleNext = () => {
    if (currentWordIndex !== null && currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSentence("");
      setOpenAIResponse(undefined);
    }
  };

  const handleAnswer = async () => {
    if (sentence.length === 0) {
      onToggleSnackBar();
      return;
    }

    setLoading(true);

    try {
      if (words.length === 0 || currentWordIndex === null) {
        return;
      }

      const resp = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant designed to output JSON.
            Make sure your response does not include any extra characters.
            The response should easily parse to JSON.

            You are part of a word learning app. You will be given a word below,
            and a sentence using that word. You determine the correct usage of the word in the
            sentence provided.

            The JSON response format should be this type declaration:

            {
              "isCorrect": boolean;
              "correctUsage": string;
              "message": string;
            }

            The message field should include a general message about the user's usage even if it was correct.
            `,
          },
          {
            role: "user",
            content: `
            Current Word: ${words[currentWordIndex].word}
            Current Sentence: ${sentence}
            `,
          },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        max_completion_tokens: 100,
      });

      const JSONResponse = cleanJsonResponse(resp.choices[0].message.content);
      setOpenAIResponse(JSONResponse as OpenAIResponseType);

      if (!JSONResponse.isCorrect) {
        Animated.sequence([
          Animated.timing(shakeAnimation, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimation, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } catch (error) {
      console.error("Error calling OpenAI:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wordData.length > 0) {
      setWords(wordData);
      setCurrentWordIndex(0);
    }
  }, []);

  if (words.length === 0 || currentWordIndex === null) {
    return <ActivityIndicator />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Animated.View
          style={[{ transform: [{ translateX: shakeAnimation }] }]}
        >
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.wordText, { color: colors.primary }]}>
                {words[currentWordIndex].word}
              </Text>
              <Text style={[styles.questionText, { color: colors.onSurface }]}>
                Write a sentence using this word
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        <TextInput
          mode="outlined"
          label="Write your sentence here"
          value={sentence}
          multiline={true}
          style={{
            minHeight: 100,
          }}
          onChangeText={(text) => setSentence(text)}
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button mode="contained" onPress={handleAnswer}>
            Check Sentence
          </Button>
        )}

        {openAIResponse && (
          <Card
            style={[
              styles.responseCard,
              {
                backgroundColor: openAIResponse.isCorrect
                  ? colors.progress
                  : "#A42941",
              },
            ]}
          >
            <Card.Content>
              <Text style={styles.responseText}>{openAIResponse.message}</Text>
              {openAIResponse.isCorrect && (
                <Button
                  mode="contained"
                  onPress={handleNext}
                  style={styles.nextButton}
                  disabled={currentWordIndex === words.length - 1}
                >
                  {currentWordIndex === words.length - 1
                    ? "Completed!"
                    : "Next Word"}
                </Button>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{
          bottom: -20,
        }}
        action={{
          label: "OK",
          onPress: () => {
            // Do something
          },
        }}
      >
        Please write a sentence using the given word above.
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 20,
  },
  card: {
    elevation: 4,
  },
  wordText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  responseCard: {
    elevation: 4,
  },
  responseText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  nextButton: {
    marginTop: 10,
  },
});
const wordData: Word[] = [
  {
    word: "Ephemeral",
    correct: "Lasting for a very short time",
    options: [
      "Lasting for a very short time",
      "Permanently enduring",
      "Highly controversial",
      "Extremely large",
    ],
  },
  {
    word: "Ubiquitous",
    correct: "Present everywhere",
    options: [
      "Rarely seen",
      "Present everywhere",
      "Uniquely beautiful",
      "Strongly scented",
    ],
  },
  {
    word: "Surreptitious",
    correct: "Kept secret, especially because it would not be approved of",
    options: [
      "Kept secret, especially because it would not be approved of",
      "Done openly and honestly",
      "Extremely loud and noticeable",
      "Carefully planned in advance",
    ],
  },
  {
    word: "Mellifluous",
    correct: "Sweet or musical; pleasant to hear",
    options: [
      "Sweet or musical; pleasant to hear",
      "Harsh and grating to the ears",
      "Silent and peaceful",
      "Loud and chaotic",
    ],
  },
  {
    word: "Paradigm",
    correct: "A typical example or pattern of something",
    options: [
      "A typical example or pattern of something",
      "A rare or unusual occurrence",
      "A mathematical equation",
      "A type of ancient writing",
    ],
  },
  {
    word: "Perfunctory",
    correct: "Done without care or interest, purely as a duty",
    options: [
      "Done without care or interest, purely as a duty",
      "Done with great attention to detail",
      "Performed perfectly",
      "Done with enthusiasm",
    ],
  },
  {
    word: "Equanimity",
    correct: "Mental calmness and composure in difficult situations",
    options: [
      "Mental calmness and composure in difficult situations",
      "Physical balance and coordination",
      "Extreme emotional reactions",
      "Social equality and fairness",
    ],
  },
  {
    word: "Pellucid",
    correct: "Translucently clear and easy to understand",
    options: [
      "Translucently clear and easy to understand",
      "Murky and difficult to comprehend",
      "Beautifully decorated",
      "Mathematically precise",
    ],
  },
  {
    word: "Quotidian",
    correct: "Of or occurring every day; ordinary or everyday",
    options: [
      "Of or occurring every day; ordinary or everyday",
      "Rare and extraordinary",
      "Ancient and historical",
      "Modern and cutting-edge",
    ],
  },
  {
    word: "Ineffable",
    correct: "Too great or extreme to be expressed in words",
    options: [
      "Too great or extreme to be expressed in words",
      "Easy to describe or explain",
      "Completely ineffective",
      "Highly efficient",
    ],
  },
  {
    word: "Perspicacious",
    correct: "Having a ready insight into and understanding of things",
    options: [
      "Having a ready insight into and understanding of things",
      "Being physically perspicuous",
      "Lacking in awareness",
      "Being overly suspicious",
    ],
  },
  {
    word: "Nebulous",
    correct: "Unclear, vague, or ill-defined",
    options: [
      "Unclear, vague, or ill-defined",
      "Perfectly clear and precise",
      "Related to clouds",
      "Scientifically proven",
    ],
  },
  {
    word: "Fastidious",
    correct: "Very attentive to accuracy and detail",
    options: [
      "Very attentive to accuracy and detail",
      "Careless and sloppy",
      "Quick and hasty",
      "Extremely fast",
    ],
  },
  {
    word: "Propitious",
    correct: "Giving or indicating a good chance of success",
    options: [
      "Giving or indicating a good chance of success",
      "Indicating certain failure",
      "Relating to property",
      "Highly ambitious",
    ],
  },
  {
    word: "Truculent",
    correct: "Eager or quick to argue or fight; aggressively defiant",
    options: [
      "Eager or quick to argue or fight; aggressively defiant",
      "Peaceful and agreeable",
      "Slow and methodical",
      "Honest and trustworthy",
    ],
  },
  {
    word: "Insidious",
    correct: "Proceeding in a gradual, subtle way, but with harmful effects",
    options: [
      "Proceeding in a gradual, subtle way, but with harmful effects",
      "Obviously dangerous",
      "Completely harmless",
      "Quick and noticeable",
    ],
  },
  {
    word: "Sagacious",
    correct: "Having or showing keen mental discernment and good judgment",
    options: [
      "Having or showing keen mental discernment and good judgment",
      "Lacking in wisdom",
      "Related to herbs and spices",
      "Physically strong",
    ],
  },
  {
    word: "Mendacious",
    correct: "Not telling the truth; lying",
    options: [
      "Not telling the truth; lying",
      "Completely honest",
      "Helpful and kind",
      "Accidentally incorrect",
    ],
  },
  {
    word: "Laconic",
    correct: "Using few words; concise",
    options: [
      "Using few words; concise",
      "Very talkative",
      "Related to lakes",
      "Extremely detailed",
    ],
  },
  {
    word: "Ephemeral",
    correct: "Lasting for a very short time",
    options: [
      "Lasting for a very short time",
      "Permanent and enduring",
      "Related to elephants",
      "Extremely important",
    ],
  },
  {
    word: "Recalcitrant",
    correct: "Having an obstinately uncooperative attitude",
    options: [
      "Having an obstinately uncooperative attitude",
      "Eager to cooperate",
      "Good at calculations",
      "Frequently recurring",
    ],
  },
  {
    word: "Sycophant",
    correct:
      "A person who acts obsequiously toward someone important to gain advantage",
    options: [
      "A person who acts obsequiously toward someone important to gain advantage",
      "A musical instrument",
      "A type of elephant",
      "A mental illness",
    ],
  },
  {
    word: "Pontificate",
    correct: "Express one's opinions in a pompous way",
    options: [
      "Express one's opinions in a pompous way",
      "Build bridges",
      "Pray in church",
      "Study ancient texts",
    ],
  },
  {
    word: "Inveterate",
    correct:
      "Having a particular habit, activity, or interest that is long-established",
    options: [
      "Having a particular habit, activity, or interest that is long-established",
      "Recently developed",
      "Related to veterinary medicine",
      "Completely changed",
    ],
  },
  {
    word: "Peripatetic",
    correct:
      "Traveling from place to place, especially working or based in various places",
    options: [
      "Traveling from place to place, especially working or based in various places",
      "Staying in one place",
      "Related to diseases",
      "Moving very slowly",
    ],
  },
];

export default SentenceSage;