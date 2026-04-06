"use client";

import { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Conversation,
  ConversationInputLine,
  ConversationPayload,
} from '@/types/conversation';

type Props = {
  open: boolean;
  onClose: () => void;
  topicId: string;
  initialData?: Conversation | null;
  onSubmit: (payload: ConversationPayload) => Promise<void>;
};

const EMPTY_LINE: ConversationInputLine = {
  speaker: '',
  englishText: '',
  vietnameseText: '',
  note: '',
};

export default function ConversationFormDialog({
  open,
  onClose,
  topicId,
  initialData,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<ConversationInputLine[]>([{ ...EMPTY_LINE }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setLines(
      initialData?.lines?.length
        ? initialData.lines.map((line) => ({
            speaker: line.speaker || '',
            englishText: line.englishText || '',
            vietnameseText: line.vietnameseText || '',
            note: line.note || '',
          }))
        : [{ ...EMPTY_LINE }],
    );
  }, [initialData, open]);

  const updateLine = (index: number, key: keyof ConversationInputLine, value: string) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, [key]: value } : line)));
  };

  const addLine = () => {
    setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  };

  const removeLine = (index: number) => {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const hasValidLines = useMemo(
    () =>
      lines.some(
        (line) =>
          line.speaker.trim() && line.englishText.trim() && line.vietnameseText.trim(),
      ),
    [lines],
  );

  const handleSubmit = async () => {
    const normalizedLines = lines
      .map((line, index) => ({
        speaker: line.speaker.trim(),
        englishText: line.englishText.trim(),
        vietnameseText: line.vietnameseText.trim(),
        note: line.note?.trim() || '',
        orderIndex: index + 1,
      }))
      .filter((line) => line.speaker && line.englishText && line.vietnameseText);

    setLoading(true);
    try {
      await onSubmit({
        topicId,
        title: title.trim(),
        description: description.trim(),
        lines: normalizedLines,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {initialData ? 'Chỉnh sửa hội thoại song ngữ' : 'Thêm hội thoại song ngữ'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                label="Tiêu đề hội thoại"
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

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1 }}
          >
            <Box>
              <Typography variant="h6">Các câu thoại</Typography>
              <Typography variant="body2" color="text.secondary">
                Mỗi dòng gồm người nói, câu tiếng Anh và bản dịch tiếng Việt.
              </Typography>
            </Box>
            <Button startIcon={<AddIcon />} variant="outlined" onClick={addLine}>
              Thêm câu
            </Button>
          </Stack>

          <Stack spacing={2}>
            {lines.map((line, index) => (
              <Box
                key={`line-${index}`}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={700}>Câu {index + 1}</Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeLine(index)}
                      disabled={lines.length === 1}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Người nói"
                        placeholder="Doctor / Patient / Teacher..."
                        value={line.speaker}
                        onChange={(e) => updateLine(index, 'speaker', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField
                        fullWidth
                        label="Ghi chú"
                        placeholder="Tùy chọn"
                        value={line.note}
                        onChange={(e) => updateLine(index, 'note', e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Nội dung tiếng Anh"
                    value={line.englishText}
                    onChange={(e) => updateLine(index, 'englishText', e.target.value)}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Nội dung tiếng Việt"
                    value={line.vietnameseText}
                    onChange={(e) => updateLine(index, 'vietnameseText', e.target.value)}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider />
          <Typography variant="body2" color="text.secondary">
            Khi lưu, thứ tự câu sẽ được sắp tự động từ trên xuống dưới.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !hasValidLines}
        >
          {loading ? 'Lưu...' : 'Lưu hội thoại'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
