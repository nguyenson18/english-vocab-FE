"use client";

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TopicFormDialog from '@/components/topic/TopicFormDialog';
import { topicService } from '@/services/topic.service';
import { Topic } from '@/types/topic';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTopics = async () => {
  try {
    setLoading(true);
    setError('');
    const topicList = await topicService.getTopics();
    setTopics(Array.isArray(topicList) ? topicList : []);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load topics');
    setTopics([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadTopics();
  }, []);

  const handleCreateOrUpdate = async (payload: Partial<Topic>) => {
    if (editingTopic) {
      await topicService.updateTopic(editingTopic.id, payload);
    } else {
      await topicService.createTopic(payload);
    }
    await loadTopics();
    setEditingTopic(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this topic?')) return;
    await topicService.deleteTopic(id);
    await loadTopics();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4">Chủ đề</Typography>
          <Typography color="text.secondary">
            Sắp xếp từ vựng theo chủ đề và mở chế độ học hoặc kiểm tra.
          </Typography>
        </div>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Tạo chủ đề
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {topics?.map((topic) => (
            <Grid key={topic.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderTop: `6px solid ${topic.color}` }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start">
                      <div>
                        <Typography variant="h6">{topic.name}</Typography>
                        <Typography color="text.secondary">
                          {topic.description || 'Không có mô tả'}
                        </Typography>
                      </div>
                      <Stack direction="row">
                        <IconButton
                          onClick={() => {
                            setEditingTopic(topic);
                            setOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(topic.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Chip label={`${topic.vocabularies?.length || 0} từ`} sx={{ width: 'fit-content' }} />

                    <Stack direction="row" spacing={1}>
                      <Button component={Link} href={`/topics/${topic.id}`} variant="outlined">
                        Quản lý từ
                      </Button>
                      <Button component={Link} href={`/topics/${topic.id}/learn`} variant="outlined">
                        Học
                      </Button>
                      <Button component={Link} href={`/topics/${topic.id}/quiz`} variant="contained">
                        Kiểm tra
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <TopicFormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingTopic(null);
        }}
        initialData={editingTopic}
        onSubmit={handleCreateOrUpdate}
      />
    </Stack>
  );
}
