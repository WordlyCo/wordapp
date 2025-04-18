import { DifficultyLevel } from "./enums";
import { BaseEntity } from "./base";
import { Quiz } from "./quiz";

export type Word = BaseEntity & {
  word: string;
  definition: string;
  difficultyLevel: DifficultyLevel;
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  usageNotes?: string;
  tags: string[];
  audioUrl?: string;
  imageUrl?: string;
  wordProgress: WordProgress;
  quiz?: Quiz;
};

export type WordProgress = BaseEntity & {
  userId: string;
  wordId: string;
  recognitionMasteryScore: number;
  usageMasteryScore: number;
  practiceCount: number;
  successCount: number;
  lastPracticed: Date;
  numberOfTimesToPractice: number;
};

export type WordProgressUpdate = {
  wordId: string;
  recognitionMasteryScore: number;
  usageMasteryScore: number;
  practiceCount: number;
  successCount: number;
  lastPracticed: Date;
  numberOfTimesToPractice: number;
};
