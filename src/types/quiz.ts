export type QuizQuestion = {
  vocabularyId: string;
  englishWord: string;
  correctAnswer: string;
  options: string[];
};

export type QuizSummary = {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
};

export type QuizHistoryItem = {
  id: string;
  topicId: string;
  quizType: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  createdAt: string;
  topic?: {
    name: string;
  };
};
