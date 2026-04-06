export type ConversationLine = {
  id?: string;
  conversationId?: string;
  speaker: string;
  orderIndex: number;
  englishText: string;
  vietnameseText: string;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Conversation = {
  id: string;
  topicId: string;
  title: string;
  description?: string | null;
  lines: ConversationLine[];
  createdAt: string;
  updatedAt: string;
};

export type ConversationInputLine = {
  speaker: string;
  englishText: string;
  vietnameseText: string;
  note?: string;
};

export type ConversationPayloadLine = {
  speaker: string;
  orderIndex: number;
  englishText: string;
  vietnameseText: string;
  note?: string;
};

export type ConversationPayload = {
  topicId: string;
  title: string;
  description?: string;
  lines: ConversationPayloadLine[];
};
