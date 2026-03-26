"use client";

import { ReactNode } from 'react';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <Box minHeight="100vh">
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Ghi nhớ từ vựng tiếng Anh
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} href="/">
              Trang chủ
            </Button>
            <Button color="inherit" component={Link} href="/topics">
              Chủ đề
            </Button>
            <Button color="inherit" component={Link} href="/progress">
              Tiến trình
            </Button>
            <Button color="inherit" component={Link} href="/review">
              Ôn tập
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
