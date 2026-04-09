"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { useParams } from "next/navigation";
import ConversationFormDialog from "@/components/conversation/ConversationFormDialog";
import PassageFormDialog from "@/components/passage/PassageFormDialog";
import VocabularyFormDialog from "@/components/vocabulary/VocabularyFormDialog";
import { conversationService } from "@/services/conversation.service";
import { passageService } from "@/services/passage.service";
import { topicService } from "@/services/topic.service";
import { Conversation, ConversationPayload } from "@/types/conversation";
import { Passage, PassagePayload } from "@/types/passage";
import { Topic, Vocabulary } from "@/types/topic";

type VocabularySubmitPayload = {
  form: Partial<Vocabulary>;
  file?: File | null;
  removeImage?: boolean;
};

const getPreview = (text?: string | null, maxLength = 220) => {
  if (!text) return "";
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength).trim()}...`
    : normalized;
};

export default function TopicDetailPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [openVocabularyDialog, setOpenVocabularyDialog] = useState(false);
  const [openConversationDialog, setOpenConversationDialog] = useState(false);
  const [openPassageDialog, setOpenPassageDialog] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(
    null,
  );
  const [editingConversation, setEditingConversation] =
    useState<Conversation | null>(null);
  const [editingPassage, setEditingPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadData = async (nextTopicId: string) => {
    try {
      setLoading(true);
      setError("");
      const [topicRes, vocabRes, conversationRes, passageRes] =
        await Promise.all([
          topicService.getTopicById(nextTopicId),
          topicService.getVocabulariesByTopic(nextTopicId),
          conversationService.getConversations(nextTopicId),
          passageService.getPassages(nextTopicId),
        ]);
      setTopic(topicRes);
      setVocabularies(vocabRes);
      setConversations(Array.isArray(conversationRes) ? conversationRes : []);
      setPassages(Array.isArray(passageRes) ? passageRes : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      loadData(topicId);
    }
  }, [topicId]);

  const handleCreateOrUpdateVocabulary = async ({
    form,
    file,
    removeImage,
  }: VocabularySubmitPayload) => {
    setActionError("");
    try {
      let savedVocabulary: Vocabulary;

      if (editingVocabulary) {
        savedVocabulary = await topicService.updateVocabulary(
          editingVocabulary.id,
          form,
        );

        if (removeImage) {
          await topicService.removeVocabularyImage(editingVocabulary.id);
        }

        if (file) {
          await topicService.uploadVocabularyImage(editingVocabulary.id, file);
        }
      } else {
        savedVocabulary = await topicService.createVocabulary(form);

        if (file) {
          await topicService.uploadVocabularyImage(savedVocabulary.id, file);
        }
      }

      await loadData(topicId);
      setEditingVocabulary(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to save vocabulary",
      );
      throw err;
    }
  };

  const handleDeleteVocabulary = async (id: string) => {
    if (!window.confirm("Delete this vocabulary?")) return;
    setActionError("");
    try {
      await topicService.deleteVocabulary(id);
      await loadData(topicId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete vocabulary",
      );
    }
  };

  const handleCreateOrUpdateConversation = async (
    payload: ConversationPayload,
  ) => {
    setActionError("");
    try {
      if (editingConversation) {
        await conversationService.updateConversation(
          editingConversation.id,
          payload,
        );
      } else {
        await conversationService.createConversation(payload);
      }

      await loadData(topicId);
      setEditingConversation(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to save conversation",
      );
      throw err;
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!window.confirm("Delete this conversation?")) return;
    setActionError("");
    try {
      await conversationService.deleteConversation(id);
      await loadData(topicId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete conversation",
      );
    }
  };

  const handleCreateOrUpdatePassage = async (payload: PassagePayload) => {
    setActionError("");
    try {
      if (editingPassage) {
        await passageService.updatePassage(editingPassage.id, payload);
      } else {
        await passageService.createPassage(payload);
      }
      await loadData(topicId);
      setEditingPassage(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to save passage",
      );
      throw err;
    }
  };

  const handleDeletePassage = async (id: string) => {
    if (!window.confirm("Delete this passage?")) return;
    setActionError("");
    try {
      await passageService.deletePassage(id);
      await loadData(topicId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete passage",
      );
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4">{topic?.name || "Topic detail"}</Typography>
          <Typography color="text.secondary">
            Quản lý từ vựng, hội thoại và đoạn văn song ngữ cho chủ đề này.
          </Typography>
        </div>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            component={Link}
            href={`/topics/${topicId}/learn`}
            variant="outlined"
          >
            Học
          </Button>
          <Button
            component={Link}
            href={`/topics/${topicId}/quiz`}
            variant="outlined"
          >
            Kiểm tra
          </Button>
          <Button variant="outlined" onClick={() => setOpenPassageDialog(true)}>
            Thêm đoạn văn
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenConversationDialog(true)}
          >
            Thêm hội thoại
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenVocabularyDialog(true)}
          >
            Thêm từ
          </Button>
        </Stack>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {actionError ? <Alert severity="warning">{actionError}</Alert> : null}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">Từ vựng</Typography>
                    <Typography color="text.secondary">
                      Danh sách từ vựng thuộc chủ đề này.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${vocabularies.length} từ`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ảnh</TableCell>
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
                        <TableCell>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.englishWord}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{item.englishWord}</TableCell>
                        <TableCell>{item.vietnameseMeaning}</TableCell>
                        <TableCell>{item.pronunciation || "-"}</TableCell>
                        <TableCell>{item.partOfSpeech || "-"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setEditingVocabulary(item);
                              setOpenVocabularyDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteVocabulary(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {vocabularies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography color="text.secondary">
                            Chưa có từ vựng nào.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">Hội thoại song ngữ</Typography>
                    <Typography color="text.secondary">
                      Thêm các đoạn đối thoại tiếng Anh và tiếng Việt để học
                      theo ngữ cảnh.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${conversations.length} hội thoại`}
                    color="secondary"
                    variant="outlined"
                  />
                </Stack>

                {conversations.length === 0 ? (
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Typography color="text.secondary">
                      Chưa có hội thoại nào. Hãy thêm một đoạn hội thoại đầu
                      tiên cho chủ đề này.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {conversations.map((conversation) => (
                      <Accordion key={conversation.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
                            width="100%"
                            spacing={1}
                            sx={{ pr: 2 }}
                          >
                            <Box>
                              <Typography fontWeight={700}>
                                {conversation.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {conversation.description || "Không có mô tả"}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={`${conversation.lines?.length || 0} câu thoại`}
                              variant="outlined"
                            />
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                              spacing={1}
                            >
                              <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                  setEditingConversation(conversation);
                                  setOpenConversationDialog(true);
                                }}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() =>
                                  handleDeleteConversation(conversation.id)
                                }
                              >
                                Xóa
                              </Button>
                            </Stack>

                            <Divider />

                            <Stack spacing={1.5}>
                              {conversation.lines
                                ?.slice()
                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                .map((line, index) => (
                                  <Box
                                    key={
                                      line.id || `${conversation.id}-${index}`
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      backgroundColor: "#f8fafc",
                                      p: 2,
                                    }}
                                  >
                                    <Stack spacing={1}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <Typography fontWeight={700}>
                                          {index + 1}. {line.speaker}
                                        </Typography>
                                        {line.note ? (
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            {line.note}
                                          </Typography>
                                        ) : null}
                                      </Stack>
                                      <Typography>
                                        {line.englishText}
                                      </Typography>
                                      <Typography color="text.secondary">
                                        {line.vietnameseText}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                ))}
                            </Stack>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">Đoạn văn song ngữ</Typography>
                    <Typography color="text.secondary">
                      Dùng cho bài đọc, đoạn mô tả hoặc ngữ cảnh dài có bản
                      tiếng Anh và tiếng Việt.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${passages.length} đoạn văn`}
                    color="success"
                    variant="outlined"
                  />
                </Stack>

                {passages.length === 0 ? (
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Typography color="text.secondary">
                      Chưa có đoạn văn nào. Bạn có thể thêm bài đọc đầu tiên cho
                      chủ đề này.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {passages.map((passage) => (
                      <Accordion key={passage.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
                            width="100%"
                            spacing={1}
                            sx={{ pr: 2 }}
                          >
                            <Box>
                              <Typography fontWeight={700}>
                                {passage.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {passage.description ||
                                  getPreview(passage.englishContent, 120) ||
                                  "Không có mô tả"}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={`${Math.max(1, Math.ceil((passage.englishContent || "").length / 280))} đoạn hiển thị`}
                              variant="outlined"
                            />
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                              spacing={1}
                            >
                              <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                  setEditingPassage(passage);
                                  setOpenPassageDialog(true);
                                }}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeletePassage(passage.id)}
                              >
                                Xóa
                              </Button>
                            </Stack>

                            <Divider />

                            <Stack spacing={2}>
                              <Box
                                sx={{
                                  borderRadius: 2,
                                  backgroundColor: "#f8fafc",
                                  p: 2,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                <Typography fontWeight={700} sx={{ mb: 1 }}>
                                  English
                                </Typography>
                                <Typography>
                                  {passage.englishContent}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  borderRadius: 2,
                                  backgroundColor: "#f8fafc",
                                  p: 2,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                <Typography fontWeight={700} sx={{ mb: 1 }}>
                                  Tiếng Việt
                                </Typography>
                                <Typography color="text.secondary">
                                  {passage.vietnameseContent}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      <VocabularyFormDialog
        open={openVocabularyDialog}
        onClose={() => {
          setOpenVocabularyDialog(false);
          setEditingVocabulary(null);
        }}
        topicId={topicId}
        initialData={editingVocabulary}
        onSubmit={handleCreateOrUpdateVocabulary}
      />

      <ConversationFormDialog
        open={openConversationDialog}
        onClose={() => {
          setOpenConversationDialog(false);
          setEditingConversation(null);
        }}
        topicId={topicId}
        initialData={editingConversation}
        onSubmit={handleCreateOrUpdateConversation}
      />

      <PassageFormDialog
        open={openPassageDialog}
        onClose={() => {
          setOpenPassageDialog(false);
          setEditingPassage(null);
        }}
        topicId={topicId}
        initialData={editingPassage}
        onSubmit={handleCreateOrUpdatePassage}
      />
    </Stack>
  );
}
