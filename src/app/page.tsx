"use client";

import { useEffect, useState } from 'react';
import { Alert, Grid, Stack, Typography } from '@mui/material';
import StatCard from '@/components/common/StatCard';
import { progressService } from '@/services/progress.service';
import { topicService } from '@/services/topic.service';
import { ProgressOverview } from '@/types/progress';
import { Topic } from '@/types/topic';

export default function HomePage() {
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([progressService.getOverview(), topicService.getTopics()])
      .then(([overviewRes, topicsRes]) => {
        setOverview(overviewRes);
        setTopics(topicsRes);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      });
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Trang chủ</Typography>
        <Typography color="text.secondary">
          Học từ vựng tiếng Anh theo chủ đề, làm bài kiểm tra tự đánh giá, và theo dõi tiến trình của bạn.
        </Typography>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Tổng chủ đề" value={topics.length} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Tổng từ vựng" value={overview?.totalWords || 0} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Đã học thuộc" value={overview?.masteredWords || 0} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard label="Độ chính xác" value={`${overview?.accuracyRate || 0}%`} />
        </Grid>
      </Grid>
    </Stack>
  );
}
