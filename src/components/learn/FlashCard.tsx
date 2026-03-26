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
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Vocabulary } from "@/types/topic";

type FlashCardProps = {
  item: Vocabulary;
  onNext: () => void;
};

export default function FlashCard({ item, onNext }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
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
    };
  }, []);

  useEffect(() => {
    setFlipped(false);
  }, [item]);

  const englishVoice = useMemo(() => {
    return (
      voices.find((v) => v.lang.toLowerCase().includes("en-us")) ||
      voices.find((v) => v.lang.toLowerCase().includes("en-gb")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
      null
    );
  }, [voices]);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!item?.englishWord) return;

    const utterance = new SpeechSynthesisUtterance(item.englishWord);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 100
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={3} alignItems="center">
          {!flipped ? (
            <>
              <Stack direction="column" spacing={1} alignItems="center">
                <Typography variant="h3" fontWeight={700}>
                  {item.englishWord}
                </Typography>

                <Tooltip title="Đọc từ tiếng Anh">
                  <IconButton onClick={handleSpeak}>
                    <VolumeUpIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              {item.pronunciation ? (
                <Typography color="text.secondary">
                  /{item.pronunciation}/
                </Typography>
              ) : null}

              <Button variant="contained" onClick={() => setFlipped(true)}>
                Lật thẻ
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" fontWeight={600}>
                {item.vietnameseMeaning}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => setFlipped(false)}>
                  Xem lại
                </Button>
                <Button variant="contained" onClick={onNext}>
                  Từ tiếp theo
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}