"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Button,
  Box,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Vocabulary } from "@/types/topic";

type FlashCardProps = {
  item: Vocabulary;
  onNext: () => void;
};

export default function FlashCard({ item, onNext }: FlashCardProps) {
  const [showMeaning, setShowMeaning] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      setVoices(synth.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    setShowMeaning(false);
  }, [item]);

  const englishVoice = useMemo(() => {
  const lower = (text: string) => text.toLowerCase();

  const femaleVoiceKeywords = [
    "female",
    "zira",
    "jenny",
    "aria",
    "samantha",
    "karen",
    "moira",
    "ava",
    "emma",
    "libby",
    "sonia",
  ];

  const englishVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith("en")
  );

  return (
    englishVoices.find((v) =>
      femaleVoiceKeywords.some((keyword) =>
        lower(`${v.name} ${v.voiceURI}`).includes(keyword)
      )
    ) ||
    englishVoices.find((v) => v.lang.toLowerCase().includes("en-us")) ||
    englishVoices.find((v) => v.lang.toLowerCase().includes("en-gb")) ||
    englishVoices[0] ||
    null
  );
}, [voices]);

  const SELECTED_VOICE_NAME = "Google UK English Female";
  const selectedVoice = useMemo(() => {
  return (
    voices.find(
      (v) =>
        v.name === "Google UK English Female" ||
        v.voiceURI === "Google UK English Female"
    ) || null
  );
}, [voices]);
 const handleSpeak = () => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!item?.englishWord) return;

  const utterance = new SpeechSynthesisUtterance(item.englishWord);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

  return (
    <Stack spacing={3} sx={{ maxWidth: 1000, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
      >
        {/* Card tiếng Anh */}
        <Card
          sx={{
            flex: 1,
            minHeight: 260,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardContent sx={{ width: "100%" }}>
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <Typography variant="overline" color="text.secondary">
                English
              </Typography>

              <Typography
                variant="h3"
                fontWeight={700}
                textAlign="center"
                sx={{ wordBreak: "break-word" }}
              >
                {item.englishWord}
              </Typography>

              {item.pronunciation ? (
                <Typography color="text.secondary">
                  /{item.pronunciation}/
                </Typography>
              ) : null}

              <Tooltip title="Đọc từ tiếng Anh">
                <IconButton onClick={handleSpeak} size="large">
                  <VolumeUpIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>

        {/* Card tiếng Việt */}
        <Card
          sx={{
            flex: 1,
            minHeight: 260,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: showMeaning ? "background.paper" : "grey.100",
          }}
        >
          <CardContent sx={{ width: "100%" }}>
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <Typography variant="overline" color="text.secondary">
                Vietnamese
              </Typography>

              {showMeaning ? (
                <Typography
                  variant="h4"
                  fontWeight={600}
                  textAlign="center"
                  sx={{ wordBreak: "break-word" }}
                >
                  {item.vietnameseMeaning}
                </Typography>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed",
                    borderColor: "grey.400",
                    borderRadius: 3,
                    px: 2,
                  }}
                >
                  <Typography color="text.secondary" textAlign="center">
                    Nhấn “Mở nghĩa” để xem tiếng Việt
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center">
        {!showMeaning ? (
          <Button variant="contained" onClick={() => setShowMeaning(true)}>
            Mở nghĩa
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => setShowMeaning(false)}>
            Ẩn nghĩa
          </Button>
        )}

        <Button variant="contained" onClick={onNext}>
          Từ tiếp theo
        </Button>
      </Stack>
    </Stack>
  );
}