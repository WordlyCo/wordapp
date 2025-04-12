export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const NOTIFICATION_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export const SESSION_TYPES = {
  MCQ: "mcq",
  SS: "ss",
} as const;

export const PARTS_OF_SPEECH = {
  NOUN: "noun",
  VERB: "verb",
  ADJECTIVE: "adjective",
  ADVERB: "adverb",
} as const;

export type DifficultyLevel =
  (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];
export type Theme = (typeof THEMES)[keyof typeof THEMES];
export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
export type SessionType = (typeof SESSION_TYPES)[keyof typeof SESSION_TYPES];
export type PartOfSpeech =
  (typeof PARTS_OF_SPEECH)[keyof typeof PARTS_OF_SPEECH];

export const CARD_HEIGHT = 150;
export const SCROLL_DISTANCE_PER_CARD = 160;
