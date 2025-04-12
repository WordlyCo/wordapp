import { DifficultyLevel } from "./enums";
import { BaseEntity } from "./base";

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
  wordProgress?: WordProgress;
};

export type WordProgress = BaseEntity & {
  userId: string;
  wordId: string;
  recognitionLevel: number;
  usageLevel: number;
  masteryScore: number;
  practiceCount: number;
  successCount: number;
};
