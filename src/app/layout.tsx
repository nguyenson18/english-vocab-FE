import type { Metadata } from 'next';
import ClientProviders from '@/components/providers/ClientProviders';
import AppShell from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ghi nhớ từ vựng tiếng Anh',
  description: 'Learn and memorize English vocabulary by topic',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
