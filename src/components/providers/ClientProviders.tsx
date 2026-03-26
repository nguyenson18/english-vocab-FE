"use client";

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { appTheme } from '@/theme/theme';

type Props = {
  children: ReactNode;
};

export default function ClientProviders({ children }: Props) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
