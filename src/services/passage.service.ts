import { api } from '@/lib/api';
import { ApiEnvelope } from '@/types/common';
import { Passage, PassagePayload } from '@/types/passage';

const unwrap = async <T>(request: Promise<ApiEnvelope<T>>): Promise<T> => {
  const response = await request;
  return response.data;
};

export const passageService = {
  getPassages: async (topicId?: string): Promise<Passage[]> =>
    unwrap(
      api.get<ApiEnvelope<Passage[]>>(
        topicId ? `/passages?topicId=${encodeURIComponent(topicId)}` : '/passages',
      ),
    ),

  getPassageById: async (id: string): Promise<Passage> =>
    unwrap(api.get<ApiEnvelope<Passage>>(`/passages/${id}`)),

  createPassage: async (payload: PassagePayload): Promise<Passage> =>
    unwrap(api.post<ApiEnvelope<Passage>>('/passages', payload)),

  updatePassage: async (id: string, payload: Partial<PassagePayload>): Promise<Passage> =>
    unwrap(api.patch<ApiEnvelope<Passage>>(`/passages/${id}`, payload)),

  deletePassage: async (id: string): Promise<{ id: string }> =>
    unwrap(api.delete<ApiEnvelope<{ id: string }>>(`/passages/${id}`)),
};
