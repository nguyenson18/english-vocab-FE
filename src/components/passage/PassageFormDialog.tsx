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
  Typography,
} from '@mui/material';
import { Passage, PassagePayload } from '@/types/passage';

type Props = {
  open: boolean;
  onClose: () => void;
  topicId: string;
  initialData?: Passage | null;
  onSubmit: (payload: PassagePayload) => Promise<void>;
};

export default function PassageFormDialog({
  open,
  onClose,
  topicId,
  initialData,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [englishContent, setEnglishContent] = useState('');
  const [vietnameseContent, setVietnameseContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setEnglishContent(initialData?.englishContent || '');
    setVietnameseContent(initialData?.vietnameseContent || '');
  }, [initialData, open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        topicId,
        title: title.trim(),
        description: description.trim(),
        englishContent: englishContent.trim(),
        vietnameseContent: vietnameseContent.trim(),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? 'Chỉnh sửa đoạn văn song ngữ' : 'Thêm đoạn văn song ngữ'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Dùng cho bài đọc hoặc đoạn văn mô tả. Mỗi bản ghi gồm 1 nội dung tiếng Anh và 1 bản dịch tiếng Việt.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                label="Tiêu đề đoạn văn"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                label="Mô tả ngắn"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            minRows={8}
            label="Nội dung tiếng Anh"
            value={englishContent}
            onChange={(e) => setEnglishContent(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            minRows={8}
            label="Nội dung tiếng Việt"
            value={vietnameseContent}
            onChange={(e) => setVietnameseContent(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !title.trim() ||
            !englishContent.trim() ||
            !vietnameseContent.trim()
          }
        >
          {loading ? 'Lưu...' : 'Lưu đoạn văn'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
