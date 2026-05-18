import * as React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const unstable_instant = { prefetch: 'static' };

export const metadata: Metadata = {
  title: 'EduAgent AI — Adaptive Educational AI Tutor',
  description: 'Structured lesson paths, auto-generated revision notes, voice explanations, and progress telemetry trackers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-outfit antialiased bg-neutral-950 text-neutral-100 min-h-screen selection:bg-emerald-500/25 selection:text-emerald-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
