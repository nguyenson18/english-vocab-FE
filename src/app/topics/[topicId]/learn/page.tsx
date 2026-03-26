"use client";

import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import FlashCard from '@/components/learn/FlashCard';
import { topicService } from '@/services/topic.service';
import { Vocabulary } from '@/types/topic';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export default function LearnPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!topicId) return;

    topicService
      .getVocabulariesByTopic(topicId)
      .then((res) => {
        const shuffledWords = shuffleArray(res);
        setWords(shuffledWords);
        setCurrentIndex(0);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load words')
      );
  }, [topicId]);

  const currentWord = words[currentIndex];

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Học từ vựng</Typography>
        <Typography color="text.secondary">
          Xem xét một từ tại một thời điểm và lật thẻ để xem nghĩa.
        </Typography>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!currentWord && !error ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : null}

      {currentWord ? (
        <>
          <Typography align="center" color="text.secondary">
            {currentIndex + 1} / {words.length}
          </Typography>

          <FlashCard
            item={currentWord}
            onNext={() => setCurrentIndex((prev) => (prev + 1) % words.length)}
          />
        </>
      ) : null}
    </Stack>
  );
}