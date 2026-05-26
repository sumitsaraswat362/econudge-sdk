import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ImpactProvider } from '@/context/ImpactContext';
import LayoutClient from '@/components/LayoutClient';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'EcoNudge SDK — Sustainable Decision Engine',
  description:
    'A drop-in SDK that intercepts user decisions and provides real-time, context-aware green alternatives. Built for the GreenHack hackathon.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">
        <ImpactProvider>
          <LayoutClient>{children}</LayoutClient>
        </ImpactProvider>
      </body>
    </html>
  );
}
