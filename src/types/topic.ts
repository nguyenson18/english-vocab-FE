export type Topic = {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  vocabularies?: Vocabulary[];
};

export type Vocabulary = {
  id: string;
  topicId: string;
  englishWord: string;
  vietnameseMeaning: string;
  pronunciation?: string | null;
  partOfSpeech?: string | null;
  exampleEn?: string | null;
  exampleVi?: string | null;
  note?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: string;
  updatedAt: string;
};
