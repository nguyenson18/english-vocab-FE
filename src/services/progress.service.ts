import { api } from '@/lib/api';
import { ApiEnvelope } from '@/types/common';
import { ProgressOverview, ProgressWord } from '@/types/progress';

const unwrap = async <T>(request: Promise<ApiEnvelope<T>>): Promise<T> => {
  const response = await request;
  return response.data?.data;
};

export const progressService = {
  getOverview: async (): Promise<ProgressOverview> =>
    unwrap(api.get<ApiEnvelope<ProgressOverview>>('/progress/overview')),

  getWrongWords: async (): Promise<ProgressWord[]> =>
    unwrap(api.get<ApiEnvelope<ProgressWord[]>>('/progress/wrong-words')),

  getReviewDue: async (): Promise<ProgressWord[]> =>
    unwrap(api.get<ApiEnvelope<ProgressWord[]>>('/progress/review-due')),
};