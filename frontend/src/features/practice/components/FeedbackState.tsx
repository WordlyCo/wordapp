import { Button, Text, Divider, Chip, Surface, Badge, FAB } from "react-native-paper";
import { Animated, View, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { IconButton } from "react-native-paper";
import WordMasteryProgress from "@/src/components/WordMasteryProgress";
import { Word } from "@/src/types/words";
import { DifficultyLevel, DIFFICULTY_LEVELS } from "@/src/types/enums";
import { Portal } from "react-native-paper";

type FeedbackStateProps = {
  currentWord: Word | null;
  numberOfWords: number;
  colors: any;
  fadeAnim: any;
  scaleAnim: any;
  slideAnim: any;
  selectedAnswer: string;
  currentIndex: number;
  handleNext: () => void;
};

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: DifficultyLevel, colors: any) => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return colors.beginner || "#4CAF50"; // Green
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return colors.intermediate || "#2196F3"; // Blue
    case DIFFICULTY_LEVELS.ADVANCED:
      return colors.advanced || "#FF9800"; // Orange
    default:
      return colors.beginner || "#4CAF50";
  }
};

// Helper function to get difficulty display name
const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return "Beginner";
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return "Intermediate";
    case DIFFICULTY_LEVELS.ADVANCED:
      return "Advanced";
    default:
      return "Beginner";
  }
};

// Helper function to create a color with opacity
const withOpacity = (color: string, opacity: number): string => {
  // If it's already rgba, replace the alpha
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }
  
  // If it's rgb, convert to rgba
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  // If it's a hex color
  if (color.startsWith('#')) {
    // For simplicity, return a safe default with opacity
    return `rgba(0, 0, 0, ${opacity})`;
  }
  
  // Default fallback
  return `rgba(0, 0, 0, ${opacity})`;
};

// Helper function to get difficulty icon
const getDifficultyIcon = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return "signal-cellular-1";
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return "signal-cellular-2";
    case DIFFICULTY_LEVELS.ADVANCED:
      return "signal-cellular-3";
    default:
      return "signal-cellular-1";
  }
};

const FeedbackState = ({
  currentWord,
  numberOfWords,
  colors,
  fadeAnim,
  scaleAnim,
  slideAnim,
  selectedAnswer,
  currentIndex,
  handleNext,
}: FeedbackStateProps) => {
  if (!currentWord) return null;
  
  const isCorrect = currentWord?.quiz?.correctOptions.includes(selectedAnswer);
  const difficultyColor = getDifficultyColor(currentWord.difficultyLevel, colors);
  
  return (
    <Animated.View
      style={[
        styles.feedbackContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
        },
      ]}
    >
      <View style={{ paddingBottom: 80 }}>
        {/* Feedback Card */}
      
        <Card
          style={[
            styles.feedbackCard,
            {
              backgroundColor: colors.surface,
              borderTopWidth: 0,
            },
          ]}
        >
          
            <Card.Content>
              <View style={styles.feedbackContentContainer}>
                <View style={styles.feedbackIconContainer}>
                  <View style={[
                    styles.iconSurface, 
                    {backgroundColor: isCorrect ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)"}
                  ]}>
                    <IconButton
                      icon={isCorrect ? "check-circle" : "close-circle"}
                      iconColor={isCorrect ? colors.secondary : colors.error}
                      size={36}
                    />
                  </View>
                </View>
                <View style={styles.feedbackTextContainer}>
                  <Text
                    variant="headlineSmall"
                    style={[
                      styles.feedbackTitle,
                      { color: isCorrect ? colors.secondary : colors.error },
                    ]}
                  >
                    {isCorrect ? "Excellent!" : "Not Quite"}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[styles.feedbackMessage, { color: colors.onSurface }]}
                  >
                    {isCorrect
                      ? "Well done! Keep up the good work."
                      : `The correct answer is: ${currentWord?.quiz?.correctOptions[0]}`}
                  </Text>
                </View>
              </View>
            </Card.Content>
       
        </Card>

        {/* Word Information Card */}
        <Card style={[styles.wordInfoCard, { backgroundColor: colors.surface }]}>
          <Card.Content style={styles.wordInfoContent}>
            <View style={styles.wordTitleRow}>
              <View style={styles.wordHeaderContainer}>
                <Text variant="headlineSmall" style={styles.wordTitle}>
                  {currentWord.word}
                </Text>
                <View style={styles.difficultyContainer}>
                  <IconButton
                    icon={getDifficultyIcon(currentWord.difficultyLevel)}
                    size={16}
                    iconColor={difficultyColor}
                    style={styles.difficultyIcon}
                  />
                  <Text variant="labelSmall" style={[styles.difficultyText, {color: difficultyColor}]}>
                    {getDifficultyLabel(currentWord.difficultyLevel)}
                  </Text>
                </View>
              </View>
              
              <Chip 
                style={[styles.partOfSpeechChip, {backgroundColor: "rgba(0, 0, 0, 0.05)"}]}
                textStyle={{fontStyle: "italic"}}
              >
                {currentWord.partOfSpeech}
              </Chip>
            </View>
            
            {/* Word Mastery Progress */}
            <View style={styles.masteryProgressContainer}>
              { (
                <View style={styles.simpleMasteryContainer}>
                  <View style={styles.masteryLevelContainer}>
                    <Text variant="labelMedium" style={styles.masteryLabel}>Recognition</Text>
                    <View style={styles.levelIndicatorRow}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <View 
                          key={`recognition-${level}`}
                          style={[
                            styles.levelDot,
                            {
                              backgroundColor: level <= (currentWord.wordProgress?.recognitionLevel || 0) 
                                ? colors.primary 
                                : withOpacity(colors.primary, 0.2)
                            }
                          ]}
                        />
                      ))}
                      <Text variant="titleSmall" style={{color: colors.primary, marginLeft: 8}}>
                        {currentWord.wordProgress?.recognitionLevel || 0}/5
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.masteryLevelContainer}>
                    <Text variant="labelMedium" style={styles.masteryLabel}>Usage</Text>
                    <View style={styles.levelIndicatorRow}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <View 
                          key={`usage-${level}`}
                          style={[
                            styles.levelDot,
                            {
                              backgroundColor: level <= (currentWord.wordProgress?.usageLevel || 0) 
                                ? colors.secondary 
                                : withOpacity(colors.secondary, 0.2)
                            }
                          ]}
                        />
                      ))}
                      <Text variant="titleSmall" style={{color: colors.secondary, marginLeft: 8}}>
                        {currentWord.wordProgress?.usageLevel || 0}/5
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            
            <Divider style={styles.divider} />
              
            <Text variant="titleMedium" style={styles.sectionTitle}>Definition</Text>
            <View style={[styles.definitionContainer, {backgroundColor: withOpacity(colors.onSurface, 0.05)}]}>
              <Text variant="bodyMedium" style={styles.definitionText}>
                {currentWord.definition}
              </Text>
            </View>
            
            
            {currentWord.examples && currentWord.examples.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Examples</Text>
                {currentWord.examples.slice(0, 2).map((example, index) => (
                  <View key={index} style={[styles.exampleSurface, {backgroundColor:  withOpacity(colors.onSurface, 0.05)}]}>
                    <Text variant="bodyMedium" style={styles.exampleText}>
                      "{example}"
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.wordRelationshipsContainer}>
              {(currentWord.synonyms && currentWord.synonyms.length > 0) && (
                <View style={[styles.section, styles.halfSection]}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Synonyms</Text>
                  <View style={styles.pillsContainer}>
                    {currentWord.synonyms.slice(0, 5).map((synonym, index) => (
                      <Chip 
                        key={index} 
                        style={[styles.wordPill, {backgroundColor: withOpacity(colors.secondary, 0.15)}]}
                        textStyle={{color: colors.secondary}}
                      >
                        {synonym}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}
              
              {(currentWord.antonyms && currentWord.antonyms.length > 0) && (
                <View style={[styles.section, styles.halfSection]}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Antonyms</Text>
                  <View style={styles.pillsContainer}>
                    {currentWord.antonyms.slice(0, 5).map((antonym, index) => (
                      <Chip 
                        key={index} 
                        style={[styles.wordPill, {backgroundColor: withOpacity(colors.error, 0.15)}]}
                        textStyle={{color: colors.error}}
                      >
                        {antonym}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}
            </View>
            
            {currentWord.etymology && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Etymology</Text>
                <View style={[styles.etymologySurface, {backgroundColor:  withOpacity(colors.onSurface, 0.05)}]}>
                  <Text variant="bodyMedium" style={styles.etymologyText}>
                    {currentWord.etymology}
                  </Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>


        {/* Practice Sentence Prompt */}
        {isCorrect && (
          <Card style={[styles.practiceCard, { backgroundColor: colors.surface }]}>
              <Card.Content>
                <View style={styles.sentencePromptContainer}>
                  <Text variant="titleMedium" style={[styles.promptTitle, { color: colors.primary }]}>
                    Want to practice in a sentence?
                  </Text>
                  <View style={styles.sentencePromptButtons}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        console.log("WILL IMPLEMENT");
                      }}
                      style={styles.sentencePromptButton}
                      buttonColor={colors.primary}
                      contentStyle={{ height: 48 }}
                      icon="pencil"
                    >
                      Practice Now
                    </Button>
                  </View>
                </View>
              </Card.Content>
        
          </Card>
        )}
      </View>

      {/* Using Portal to render FAB outside the scroll view context */}
      <Portal>
        <FAB
          icon={currentIndex === numberOfWords - 1 ? "flag-checkered" : "arrow-right"}
          label={currentIndex === numberOfWords - 1 ? "See Summary" : "Next Question"}
          style={[
            styles.fab, 
            { 
              backgroundColor: colors.primary,
            }
          ]}
          onPress={handleNext}
          color="#fff"
          uppercase={false}
        />
      </Portal>
    </Animated.View>
  );
};

export default FeedbackState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
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
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    minHeight: 50,
    justifyContent: "center",
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    flexWrap: "wrap",
  },
  feedbackContainer: {
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
  },
  feedbackCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 4,
  },
  wordInfoCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    overflow: "hidden",
  },
  progressCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    overflow: "hidden",

  },
  practiceCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 4,
  },
  actionsCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
  },
  feedbackContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  feedbackIconContainer: {
    marginRight: 16,
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  feedbackMessage: {
    opacity: 0.87,
  },
  nextButton: {
    borderRadius: 24,
    flex: 1,
    elevation: 2,
  },
  sentencePromptContainer: {
    marginVertical: 8,
  },
  sentencePromptButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  sentencePromptButton: {
    flex: 1,
    borderRadius: 24,
    elevation: 2,
  },
  promptTitle: {
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "bold",
  },
  summaryCard: {
    padding: 16,
    margin: 16,
  },
  summaryTitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  restartButton: {
    marginTop: 16,
  },
  wordTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  partOfSpeech: {
    fontStyle: "italic",
    fontWeight: "normal",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
  section: {
    marginTop: 16,
  },
  halfSection: {
    width: "48%",
  },
  definitionText: {
    lineHeight: 22,
  },
  exampleText: {
    fontStyle: "italic",
    lineHeight: 20,
  },
  wordListText: {
    lineHeight: 20,
  },
  etymologyText: {
    lineHeight: 20,
    fontStyle: "italic",
  },
  divider: {
    marginVertical: 12,
  },
  progressStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "space-between",
  },
  progressStat: {
    width: "48%",
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  statLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wordTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  wordHeaderContainer: {
    flex: 1,
  },
  wordMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  partOfSpeechText: {
    fontStyle: "italic",
    opacity: 0.7,
    marginRight: 12,
  },
  difficultyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyIcon: {
    margin: 0,
    padding: 0,
    marginLeft: -8,
  },
  difficultyText: {
    marginLeft: -4,
    fontSize: 12,
  },
  definitionContainer: {
    padding: 12,
    borderRadius: 8,
    
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  tagChip: {
    height: 24,
    marginRight: 4,
    marginBottom: 4,
  },
  wordInfoContent: {
    paddingVertical: 16,
  },
  exampleSurface: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  etymologySurface: {
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  iconSurface: {
    borderRadius: 40,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  wordRelationshipsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordPill: {
    marginRight: 4,
    marginBottom: 4,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    borderRadius: 28,
    elevation: 8,
    zIndex: 999,
  },
  masteryProgressContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  simpleMasteryContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  masteryLevelContainer: {
    flexDirection: 'column',
  },
  masteryLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  levelIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  partOfSpeechChip: {
    height: 28,
    marginLeft: 8,
  },
});
