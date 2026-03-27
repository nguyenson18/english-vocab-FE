"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import { quizService } from "@/services/quiz.service";
import { QuizQuestion, QuizSummary } from "@/types/quiz";

export default function QuizPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadQuiz = async (currentTopicId: string) => {
    try {
      setLoading(true);
      setError("");
      setSummary(null);

      const res = await quizService.startQuiz({
        topicId: currentTopicId,
        limit: 10,
      });

      setQuestions(res);
      setAnswers({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      loadQuiz(topicId);
    }
  }, [topicId]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => value.trim() !== "").length;
  }, [answers]);

  const handleChangeAnswer = (vocabularyId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [vocabularyId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        topicId,
        quizType: "vi_to_en",
        answers: questions.map((item) => ({
          vocabularyId: item.vocabularyId,
          userAnswer: (answers[item.vocabularyId] || "").trim(),
        })),
      };

      const res = await quizService.submitQuiz(payload);
      setSummary(res.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Câu đố</Typography>
        <Typography color="text.secondary">
          Nhập từ tiếng Anh đúng cho mỗi nghĩa tiếng Việt.
        </Typography>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : null}

      {summary ? (
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h5">Kết quả bài kiểm tra</Typography>
              <Typography>Tổng số câu: {summary.totalQuestions}</Typography>
              <Typography>Đúng: {summary.correctAnswers}</Typography>
              <Typography>Sai: {summary.wrongAnswers}</Typography>
              <Typography>Điểm: {summary.score}%</Typography>

              <Box pt={1}>
                <Button variant="contained" onClick={() => loadQuiz(topicId)}>
                  Làm lại
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !summary
        ? questions.map((question, index) => (
            <Card key={question.vocabularyId}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    {index + 1}. {question.correctAnswer}
                  </Typography>

                  <TextField
                    fullWidth
                    label="Nhập từ tiếng Anh"
                    placeholder="Ví dụ: doctor"
                    value={answers[question.vocabularyId] || ""}
                    onChange={(e) =>
                      handleChangeAnswer(question.vocabularyId, e.target.value)
                    }
                  />
                </Stack>
              </CardContent>
            </Card>
          ))
        : null}

      {!loading && !summary && questions.length > 0 ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="text.secondary">
            Đã trả lời: {answeredCount}/{questions.length}
          </Typography>

          <Button
            variant="contained"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Đang gửi..." : "Nộp bài"}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}