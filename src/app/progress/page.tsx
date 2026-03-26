"use client";

import { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import StatCard from '@/components/common/StatCard';
import { progressService } from '@/services/progress.service';
import { ProgressOverview, ProgressWord } from '@/types/progress';

export default function ProgressPage() {
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [wrongWords, setWrongWords] = useState<ProgressWord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([progressService.getOverview(), progressService.getWrongWords()])
      .then(([overviewRes, wrongWordsRes]) => {
        setOverview(overviewRes);
        setWrongWords(wrongWordsRes);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load progress');
      });
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Tiến trình học tập</Typography>
        <Typography color="text.secondary">
          Theo dõi hiệu suất học tập và những từ bạn thường sai.
        </Typography>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Tổng số từ" value={overview?.totalWords || 0} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Từ đã thành thạo" value={overview?.masteredWords || 0} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Từ đang học" value={overview?.learningWords || 0} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Tỷ lệ chính xác" value={`${overview?.accuracyRate || 0}%`} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Những từ thường sai
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Từ tiếng Anh</TableCell>
                <TableCell>Nghĩa tiếng Việt</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Số lần sai</TableCell>
                <TableCell>Số lần đúng</TableCell>
                <TableCell>Trình độ thành thạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wrongWords.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.vocabulary.englishWord}</TableCell>
                  <TableCell>{item.vocabulary.vietnameseMeaning}</TableCell>
                  <TableCell>{item.vocabulary.topic?.name || '-'}</TableCell>
                  <TableCell>{item.wrongCount}</TableCell>
                  <TableCell>{item.correctCount}</TableCell>
                  <TableCell>{item.masteryLevel}</TableCell>
                </TableRow>
              ))}
              {wrongWords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>Chưa có dữ liệu tiến trình.</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
