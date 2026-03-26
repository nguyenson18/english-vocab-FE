"use client";

import { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { progressService } from '@/services/progress.service';
import { ProgressWord } from '@/types/progress';

export default function ReviewPage() {
  const [reviewWords, setReviewWords] = useState<ProgressWord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    progressService
      .getReviewDue()
      .then((res) => setReviewWords(res))
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load review words');
      });
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Từ cần ôn tập</Typography>
        <Typography color="text.secondary">
          Những từ đang đến hạn ôn tập.
        </Typography>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Từ tiếng Anh</TableCell>
                <TableCell>Nghĩa tiếng Việt</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Ôn tập lần tiếp theo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewWords.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.vocabulary.englishWord}</TableCell>
                  <TableCell>{item.vocabulary.vietnameseMeaning}</TableCell>
                  <TableCell>{item.vocabulary.topic?.name || '-'}</TableCell>
                  <TableCell>
                    {item.nextReviewAt ? new Date(item.nextReviewAt).toLocaleString() : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {reviewWords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>Chưa có từ nào đến hạn ôn tập.</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
