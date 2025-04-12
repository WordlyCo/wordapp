import { Word } from "@/src/types/words";

export type QuizType = "mcq";

export type Question = {
  id: number;
  createdAt: string;
  updatedAt: string;
  word: Word;
  type: QuizType;
  question: string;
  options: QuestionOption[];
  correctAnswerIds: number[];
};

export type QuestionOption = {
  id: number;
  createdAt: string;
  updatedAt: string;
  questionId: number;
  option: string;
};

export type Quiz = {
  id: number;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
};
