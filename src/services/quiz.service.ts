import { api } from '@/lib/api';
import { ApiEnvelope } from '@/types/common';
import { QuizHistoryItem, QuizQuestion, QuizSummary } from '@/types/quiz';

type SubmitResponse = {
  attempt: unknown;
  summary: QuizSummary;
};

const unwrap = async <T>(request: Promise<ApiEnvelope<T>>): Promise<T> => {
  const response = await request;
  return response.data;
};

export const quizService = {
  startQuiz: async (payload: {
    topicId: string;
    limit?: number;
  }): Promise<QuizQuestion[]> =>
    unwrap(api.post<ApiEnvelope<QuizQuestion[]>>('/quiz/start', payload)),

  submitQuiz: async (payload: {
    topicId: string;
    quizType?: string;
    answers: { vocabularyId: string; userAnswer: string }[];
  }): Promise<SubmitResponse> =>
    unwrap(api.post<ApiEnvelope<SubmitResponse>>('/quiz/submit', payload)),

  getHistory: async (): Promise<QuizHistoryItem[]> =>
    unwrap(api.get<ApiEnvelope<QuizHistoryItem[]>>('/quiz/history')),
};