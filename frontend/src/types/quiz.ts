export type QuizType = "multiple_choice" | "true_false" | "fill_in_the_blank";
 
export type Quiz = {
  id: number;
  createdAt: string;
  updatedAt: string;
  wordId: number;
  quizType: QuizType;
  question: string;
  options: string[];
  correctOptions: string[];
};

export type QuizRequest = {
  wordIds: number[];
};
