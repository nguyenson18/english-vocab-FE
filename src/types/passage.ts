export type Passage = {
  id: string;
  topicId: string;
  title: string;
  description?: string | null;
  englishContent: string;
  vietnameseContent: string;
  createdAt: string;
  updatedAt: string;
};

export type PassagePayload = {
  topicId: string;
  title: string;
  description?: string;
  englishContent: string;
  vietnameseContent: string;
};
