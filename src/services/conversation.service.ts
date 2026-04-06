import { api } from '@/lib/api';
import { ApiEnvelope } from '@/types/common';
import { Conversation, ConversationPayload } from '@/types/conversation';

const unwrap = async <T>(request: Promise<ApiEnvelope<T>>): Promise<T> => {
  const response = await request;
  return response.data;
};

export const conversationService = {
  getConversations: async (topicId?: string): Promise<Conversation[]> =>
    unwrap(
      api.get<ApiEnvelope<Conversation[]>>(
        topicId ? `/conversations?topicId=${encodeURIComponent(topicId)}` : '/conversations',
      ),
    ),

  getConversationById: async (id: string): Promise<Conversation> =>
    unwrap(api.get<ApiEnvelope<Conversation>>(`/conversations/${id}`)),

  createConversation: async (payload: ConversationPayload): Promise<Conversation> =>
    unwrap(api.post<ApiEnvelope<Conversation>>('/conversations', payload)),

  updateConversation: async (id: string, payload: Partial<ConversationPayload>): Promise<Conversation> =>
    unwrap(api.patch<ApiEnvelope<Conversation>>(`/conversations/${id}`, payload)),

  deleteConversation: async (id: string): Promise<{ id: string }> =>
    unwrap(api.delete<ApiEnvelope<{ id: string }>>(`/conversations/${id}`)),
};
