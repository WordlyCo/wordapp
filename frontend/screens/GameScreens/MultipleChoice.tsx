import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import {
  Text,
  Button,
  Card,
  ProgressBar,
  IconButton,
} from "react-native-paper";
import useTheme from "@/hooks/useTheme";

const MultipleChoice = () => {
  const { colors } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));

  // Sample word data - in a real app, this would come from an API or database
  const wordData = [
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

  useEffect(() => {
    // Shuffle questions on component mount
    setQuestions(shuffleArray([...wordData]));
  }, []);

  const shuffleArray = (array) => {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct) {
      setScore(score + 1);
    } else {
      // Trigger shake animation for wrong answer
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
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      setShowAnswer(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(shuffleArray([...wordData]));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.onBackground }]}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <ProgressBar
            progress={progress}
            color={colors.progress}
            style={styles.progressBar}
          />
          <Text style={[styles.scoreText, { color: colors.onBackground }]}>
            Score: {score}/{currentQuestionIndex + 1}
          </Text>
        </View>

        {/* Question Card */}
        <Animated.View
          style={[
            styles.questionContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.wordText, { color: colors.primary }]}>
                {currentQuestion.word}
              </Text>
              <Text style={[styles.questionText, { color: colors.onSurface }]}>
                What does this word mean?
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              mode={"contained"}
              onPress={() => handleAnswer(option)}
              disabled={showAnswer}
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface },
                option !== currentQuestion.correct && {
                  borderColor: selectedAnswer === option ? colors.error : "",
                  borderWidth: selectedAnswer === option ? 2 : 0,
                },
                showAnswer &&
                  option === currentQuestion.correct && {
                    backgroundColor: colors.progress + "20",
                  },
              ]}
              labelStyle={{
                color:
                  selectedAnswer === option
                    ? colors.onPrimary
                    : colors.onSurface,
              }}
            >
              {option}
            </Button>
          ))}
        </View>

        {/* Feedback and Navigation */}
        {showAnswer && (
          <View style={styles.feedbackContainer}>
            <View
              style={{
                width: "100%",
                borderRadius: 8,
                padding: 15,
                marginVertical: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  selectedAnswer === currentQuestion.correct
                    ? colors.progress
                    : colors.errorContainer,
              }}
            >
              <Text style={[styles.feedbackText]}>
                {selectedAnswer === currentQuestion.correct
                  ? "Correct! Well done!"
                  : `Incorrect. The correct answer is: ${currentQuestion.correct}`}
              </Text>
            </View>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                mode="contained"
                onPress={nextQuestion}
                style={styles.nextButton}
              >
                Next Question
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={restartQuiz}
                style={styles.nextButton}
              >
                Restart Quiz
              </Button>
            )}
          </View>
        )}
      </ScrollView>
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
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    textAlign: "center",
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  scoreText: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: 20,
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
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 8,
  },
  feedbackContainer: {
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextButton: {
    width: "100%",
    borderRadius: 8,
  },
});

export default MultipleChoice;
