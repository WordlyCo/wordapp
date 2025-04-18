import { Word } from "./words";
import { BaseEntity } from "./base";
import { DifficultyLevel } from "./enums";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type WordList = BaseEntity & {
  name: string;
  description: string;
  imageUrl: string;
  iconName: string;
  categories: string[];
  difficultyLevel: DifficultyLevel;
  words: Word[];
  wordCount: number;
  inUsersBank: boolean;
};

export type WordListCategory = BaseEntity & {
  icon?: IconSource;
  name: string;
  description: string;
  difficultyLevel: DifficultyLevel;
  iconUrl?: string;
  accentColor?: string;
};

export type UserWordList = BaseEntity & {
  userId: string;
  name: string;
  description: string;
  words: Word[];
};
