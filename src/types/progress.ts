export type ProgressOverview = {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  totalCorrect: number;
  totalWrong: number;
  accuracyRate: number;
};

export type ProgressWord = {
  id: string;
  vocabularyId: string;
  correctCount: number;
  wrongCount: number;
  masteryLevel: string;
  lastResult?: string | null;
  nextReviewAt?: string | null;
  vocabulary: {
    englishWord: string;
    vietnameseMeaning: string;
    topic?: {
      name: string;
    };
  };
};
