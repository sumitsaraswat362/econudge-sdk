'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import LiveFeed from '@/components/LiveFeed';
import VoiceNudge from '@/components/VoiceNudge';

export default function LayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    if (text.includes('ride') || text.includes('cab') || text.includes('uber')) {
      router.push('/demo?auto=ride');
    } else if (text.includes('food') || text.includes('eat') || text.includes('order')) {
      router.push('/demo?auto=food');
    } else if (text.includes('shop') || text.includes('buy') || text.includes('clothes')) {
      router.push('/demo?auto=shop');
    } else {
      router.push('/demo?auto=ride'); // default fallback
    }
  };

  return (
    <>
      <Background />
      <Navbar />
      <div className="pt-24 min-h-screen">
        {children}
      </div>
      <LiveFeed />
      <VoiceNudge onVoiceCommand={handleVoiceCommand} />
    </>
  );
}
