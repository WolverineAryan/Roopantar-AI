import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roopantar-AI — Enterprise Multi-Format Content Transformation Engine',
  description: 'Production AI platform that ingests raw source material once and deterministically generates schema-validated presentation decks, executive summaries, advisories, and multimedia packages.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-[#EC4899] selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
