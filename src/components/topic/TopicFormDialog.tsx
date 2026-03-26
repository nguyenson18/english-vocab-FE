"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Topic } from "@/types/topic";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    description?: string;
    color?: string;
  }) => Promise<void>;
  initialData?: Topic | null;
};

export default function TopicFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#1976d2");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setColor(initialData?.color || "#1976d2");
  }, [initialData, open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ name, description, color });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Chỉnh sửa Chủ Đề" : "Tạo Chủ Đề"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tên chủ đề"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Mô tả"
            value={description}
            multiline
            minRows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Màu sắc"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          disabled={loading || !name.trim()}
          variant="contained"
          onClick={handleSubmit}
        >
          {loading ? "Lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
