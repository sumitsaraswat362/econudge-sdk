'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedEvent {
  id: string;
  user: string;
  city: string;
  platform: string;
  co2Saved: number;
  action: string;
}

export default function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    const es = new EventSource('/api/live-feed');

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const event: FeedEvent = { ...data, id: `${Date.now()}-${Math.random()}` };
        setEvents((prev) => [event, ...prev].slice(0, 3));

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setEvents((prev) => prev.filter((ev) => ev.id !== event.id));
        }, 5000);
      } catch {}
    };

    return () => es.close();
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white backdrop-blur-xl shadow-2xl"
          >
            <div className="relative shrink-0">
              <span className="text-lg">🌍</span>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">
                <span className="text-emerald-400">{event.user}</span>
                <span className="text-gray-400"> in </span>
                <span className="text-white">{event.city}</span>
              </p>
              <p className="truncate text-xs text-gray-500">
                saved <span className="text-emerald-300 font-semibold">{event.co2Saved}g CO₂</span> via {event.platform}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
