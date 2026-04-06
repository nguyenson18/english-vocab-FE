import { api } from '@/lib/api';
import { ApiEnvelope } from '@/types/common';
import { Topic, Vocabulary } from '@/types/topic';

const unwrap = async <T>(request: Promise<ApiEnvelope<T>>): Promise<T> => {
  const response = await request;
  return response.data;
};

export const topicService = {
  getTopics: async (): Promise<Topic[]> =>
    unwrap(api.get<ApiEnvelope<Topic[]>>('/topics')),

  getTopicById: async (id: string): Promise<Topic> =>
    unwrap(api.get<ApiEnvelope<Topic>>(`/topics/${id}`)),

  createTopic: async (payload: Partial<Topic>): Promise<Topic> =>
    unwrap(api.post<ApiEnvelope<Topic>>('/topics', payload)),

  updateTopic: async (id: string, payload: Partial<Topic>): Promise<Topic> =>
    unwrap(api.patch<ApiEnvelope<Topic>>(`/topics/${id}`, payload)),

  deleteTopic: async (id: string): Promise<{ id: string }> =>
    unwrap(api.delete<ApiEnvelope<{ id: string }>>(`/topics/${id}`)),

  getVocabulariesByTopic: async (topicId: string): Promise<Vocabulary[]> =>
    unwrap(api.get<ApiEnvelope<Vocabulary[]>>(`/vocabularies/topic/${topicId}`)),

  createVocabulary: async (payload: Partial<Vocabulary>): Promise<Vocabulary> =>
    unwrap(api.post<ApiEnvelope<Vocabulary>>('/vocabularies', payload)),

  updateVocabulary: async (id: string, payload: Partial<Vocabulary>): Promise<Vocabulary> =>
    unwrap(api.patch<ApiEnvelope<Vocabulary>>(`/vocabularies/${id}`, payload)),

  deleteVocabulary: async (id: string): Promise<{ id: string }> =>
    unwrap(api.delete<ApiEnvelope<{ id: string }>>(`/vocabularies/${id}`)),
};