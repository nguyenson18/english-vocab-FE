"use client";

import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { Vocabulary } from '@/types/topic';

type Props = {
  open: boolean;
  onClose: () => void;
  topicId: string;
  onSubmit: (payload: Partial<Vocabulary>) => Promise<void>;
  initialData?: Vocabulary | null;
};

export default function VocabularyFormDialog({
  open,
  onClose,
  topicId,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState<Partial<Vocabulary>>({
    topicId,
    englishWord: '',
    vietnameseMeaning: '',
    pronunciation: '',
    partOfSpeech: '',
    exampleEn: '',
    exampleVi: '',
    note: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      topicId,
      englishWord: initialData?.englishWord || '',
      vietnameseMeaning: initialData?.vietnameseMeaning || '',
      pronunciation: initialData?.pronunciation || '',
      partOfSpeech: initialData?.partOfSpeech || '',
      exampleEn: initialData?.exampleEn || '',
      exampleVi: initialData?.exampleVi || '',
      note: initialData?.note || '',
    });
  }, [initialData, topicId, open]);

  const updateField = (key: keyof Vocabulary, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ ...form, topicId });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Từ tiếng Anh"
                value={form.englishWord}
                onChange={(e) => updateField('englishWord', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nghĩa tiếng Việt"
                value={form.vietnameseMeaning}
                onChange={(e) => updateField('vietnameseMeaning', e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phiên âm"
                value={form.pronunciation}
                onChange={(e) => updateField('pronunciation', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Loại từ"
                value={form.partOfSpeech}
                onChange={(e) => updateField('partOfSpeech', e.target.value)}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Ví dụ (EN)"
            value={form.exampleEn}
            onChange={(e) => updateField('exampleEn', e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Ví dụ (VI)"
            value={form.exampleVi}
            onChange={(e) => updateField('exampleVi', e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Ghi chú"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={loading || !form.englishWord?.trim() || !form.vietnameseMeaning?.trim()}
          variant="contained"
          onClick={handleSubmit}
        >
          {loading ? 'Lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
