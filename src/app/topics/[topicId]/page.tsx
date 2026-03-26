"use client";

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import VocabularyFormDialog from '@/components/vocabulary/VocabularyFormDialog';
import { topicService } from '@/services/topic.service';
import { Topic, Vocabulary } from '@/types/topic';

export default function TopicDetailPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [open, setOpen] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async (topicId: string) => {
    console.log(topicId)
    try {
      setLoading(true);
      const [topicRes, vocabRes] = await Promise.all([
        topicService.getTopicById(topicId),
        topicService.getVocabulariesByTopic(topicId),
      ]);
      setTopic(topicRes);
      setVocabularies(vocabRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      loadData(topicId);
    }
  }, [topicId]);

  const handleCreateOrUpdate = async (payload: Partial<Vocabulary>) => {
    if (editingVocabulary) {
      await topicService.updateVocabulary(editingVocabulary.id, payload);
    } else {
      await topicService.createVocabulary(payload);
    }
    await loadData(topicId);
    setEditingVocabulary(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this vocabulary?')) return;
    await topicService.deleteVocabulary(id);
    await loadData(topicId);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4">{topic?.name || 'Topic detail'}</Typography>
          <Typography color="text.secondary">
            Quản lý từ vựng và ví dụ cho chủ đề này.
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href={`/topics/${topicId}/learn`} variant="outlined">
            Học
          </Button>
          <Button component={Link} href={`/topics/${topicId}/quiz`} variant="outlined">
            Kiểm tra
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Thêm từ
          </Button>
        </Stack>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Từ tiếng Anh</TableCell>
                  <TableCell>Nghĩa tiếng Việt</TableCell>
                  <TableCell>Phiên âm</TableCell>
                  <TableCell>Loại từ</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vocabularies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.englishWord}</TableCell>
                    <TableCell>{item.vietnameseMeaning}</TableCell>
                    <TableCell>{item.pronunciation || '-'}</TableCell>
                    <TableCell>{item.partOfSpeech || '-'}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setEditingVocabulary(item);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {vocabularies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography color="text.secondary">Chưa có từ vựng nào.</Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <VocabularyFormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingVocabulary(null);
        }}
        topicId={topicId}
        initialData={editingVocabulary}
        onSubmit={handleCreateOrUpdate}
      />
    </Stack>
  );
}
