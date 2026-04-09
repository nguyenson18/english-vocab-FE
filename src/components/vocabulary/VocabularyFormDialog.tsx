"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { Vocabulary } from "@/types/topic";
import { Delete } from "@mui/icons-material";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";

type VocabularySubmitPayload = {
  form: Partial<Vocabulary>;
  file?: File | null;
  removeImage?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  topicId: string;
  onSubmit: (payload: VocabularySubmitPayload) => Promise<void>;
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
    englishWord: "",
    vietnameseMeaning: "",
    pronunciation: "",
    partOfSpeech: "",
    exampleEn: "",
    exampleVi: "",
    note: "",
    imageUrl:"",
  });

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    setForm({
      topicId,
      englishWord: initialData?.englishWord || "",
      vietnameseMeaning: initialData?.vietnameseMeaning || "",
      pronunciation: initialData?.pronunciation || "",
      partOfSpeech: initialData?.partOfSpeech || "",
      exampleEn: initialData?.exampleEn || "",
      exampleVi: initialData?.exampleVi || "",
      note: initialData?.note || "",
      imageUrl: initialData?.imageUrl || "",
    });
    setSelectedFile(null);
    setRemoveImage(false);
  }, [initialData, topicId, open]);

  const updateField = (key: keyof Vocabulary, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        form: { ...form, topicId },
        file: selectedFile,
        removeImage,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {initialData ? "Chỉnh sửa từ vựng" : "Thêm từ vựng"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Từ tiếng Anh"
                value={form.englishWord}
                onChange={(e) => updateField("englishWord", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nghĩa tiếng Việt"
                value={form.vietnameseMeaning}
                onChange={(e) =>
                  updateField("vietnameseMeaning", e.target.value)
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phiên âm"
                value={form.pronunciation}
                onChange={(e) => updateField("pronunciation", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Loại từ"
                value={form.partOfSpeech}
                onChange={(e) => updateField("partOfSpeech", e.target.value)}
              />
            </Grid>
          </Grid>

          {/* <TextField
            fullWidth
            multiline
            minRows={2}
            label="Ví dụ (EN)"
            value={form.exampleEn}
            onChange={(e) => updateField("exampleEn", e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Ví dụ (VI)"
            value={form.exampleVi}
            onChange={(e) => updateField("exampleVi", e.target.value)}
          /> */}
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Ghi chú"
            value={form.note}
            onChange={(e) => updateField("note", e.target.value)}
          />

          <Stack spacing={1} direction="column" alignItems="center">
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {form?.imageUrl && !removeImage ? (
                <img
                  src={form.imageUrl}
                  alt={form.englishWord}
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid #ddd",
                  }}
                />
              ) : null}

              {selectedFile ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                 {form.imageUrl && ( <strong>
                    <TrendingFlatOutlinedIcon />
                  </strong>)}
                  <Box
                    component="img"
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    sx={{
                      mt: 1,
                      width: 140,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                    }}
                  />
                </Stack>
              ) : null}
            </Stack>

            <Stack
              spacing={1}
              flexDirection={{ xs: "column", sm: "row" }}
              sx={{
                display: "flex",
                justifyContent: "center",
                aglignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                sx={{ width: "150px" }}
                component="label"
              >
                Chọn ảnh
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file) setRemoveImage(false);
                  }}
                />
              </Button>

              {initialData?.imageUrl ? (
                <Button
                  color="error"
                  variant="text"
                  disabled={
                    !!form?.imageUrl &&
                    !!selectedFile &&
                    !!URL.createObjectURL(selectedFile)
                  }
                  onClick={() => {
                    setSelectedFile(null);
                    setRemoveImage(true);
                    setForm((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                >
                  <Delete />
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={
            loading ||
            !form.englishWord?.trim() ||
            !form.vietnameseMeaning?.trim()
          }
          variant="contained"
          onClick={handleSubmit}
        >
          {loading ? "Lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
