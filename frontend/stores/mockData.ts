import { WordCategory } from "./types";

export const categories: WordCategory[] = [
  {
    id: "1",
    icon: "book-open-variant",
    name: "Books",
    description: "Books",
    category: "Books",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    icon: "movie-open",
    name: "Movies",
    description: "Movies",
    category: "Movies",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    icon: "brain",
    name: "Philosophy",
    description: "Philosophy",
    category: "Philosophy",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    icon: "flask",
    name: "Science",
    description: "Science",
    category: "Science",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    icon: "laptop",
    name: "Technology",
    description: "Technology",
    category: "Technology",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    icon: "music",
    name: "Music",
    description: "Music",
    category: "Music",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    icon: "gamepad-variant",
    name: "Games",
    description: "Games",
    category: "Games",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    icon: "food",
    name: "Food",
    description: "Food",
    category: "Food",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

import { Word } from "@/stores/types";
import { DIFFICULTY_LEVELS, PARTS_OF_SPEECH } from "@/stores/enums";

export const wordData: Word[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "ephemeral",
    definition: "lasting for a very short time",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The ephemeral beauty of cherry blossoms makes them special.",
      "Social media fame can be ephemeral and fleeting.",
    ],
    synonyms: ["temporary", "fleeting", "transient", "momentary"],
    antonyms: ["permanent", "lasting", "eternal"],
    etymology: "From Greek 'ephemeros' meaning 'lasting only one day'",
    usageNotes: "Often used to describe natural phenomena or temporary states",
    tags: ["time", "nature", "description"],
    options: ["temporary", "fleeting", "transient", "momentary"],
    correctAnswer: "temporary",
  },
  {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "ubiquitous",
    definition: "present, appearing, or found everywhere",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "Smartphones have become ubiquitous in modern society.",
      "Coffee shops are ubiquitous in most major cities.",
    ],
    synonyms: ["omnipresent", "universal", "widespread"],
    antonyms: ["rare", "scarce", "uncommon"],
    etymology: "From Latin 'ubique' meaning 'everywhere'",
    usageNotes: "Commonly used to describe technology and modern phenomena",
    tags: ["presence", "technology", "society"],
    options: ["omnipresent", "universal", "widespread"],
    correctAnswer: "omnipresent",
  },
  {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "serendipity",
    definition:
      "the occurrence of finding pleasant or valuable things by chance",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.NOUN,
    exampleSentences: [
      "Meeting his future wife at the airport was pure serendipity.",
      "Many scientific discoveries happened through serendipity.",
    ],
    synonyms: ["chance", "fortune", "luck"],
    antonyms: ["misfortune", "design", "plan"],
    etymology:
      "Coined by Horace Walpole in 1754 from the Persian fairy tale 'The Three Princes of Serendip'",
    usageNotes:
      "Often used in contexts of discovery and fortunate coincidences",
    tags: ["luck", "discovery", "chance"],
    options: ["chance", "fortune", "luck"],
    correctAnswer: "chance",
  },
];

// Helper function to generate multiple choice options
export const generateMultipleChoiceOptions = (
  correctWord: Word,
  allWords: Word[]
): string[] => {
  const otherWords = allWords.filter((w) => w.id !== correctWord.id);
  const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);
  const incorrectOptions = shuffledWords.slice(0, 3).map((w) => w.definition);
  const allOptions = [...incorrectOptions, correctWord.definition];
  return allOptions.sort(() => Math.random() - 0.5);
};
