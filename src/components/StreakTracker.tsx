'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  streakCount: number;
}

const BADGES = [
  '🌟 Eco Warrior',
  '🦸 Green Hero',
  '💎 Diamond Saver',
  '🏆 Carbon Champion',
  '🌈 Rainbow Guardian',
  '🔥 Streak Master',
  '🎯 Planet Protector',
];

export default function StreakTracker({ streakCount }: Props) {
  const [showLootBox, setShowLootBox] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const displayStreak = streakCount % 5;
  const completedSets = Math.floor(streakCount / 5);

  useEffect(() => {
    if (streakCount > 0 && streakCount % 5 === 0) {
      setShowLootBox(true);
      setEarnedBadge(BADGES[Math.floor(Math.random() * BADGES.length)]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setShowLootBox(false), 5000);
    }
  }, [streakCount]);

  // CSS confetti particles
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7', '#ec4899'][i % 6],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="relative">
      {/* Streak dots */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">🔥 Green Streak</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={`h-4 w-4 rounded-full border-2 ${
                i < displayStreak
                  ? 'border-emerald-400 bg-emerald-400'
                  : 'border-gray-600 bg-transparent'
              }`}
              animate={i < displayStreak ? { scale: [1, 1.3, 1] } : {}}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
        {completedSets > 0 && (
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
            ×{completedSets}
          </span>
        )}
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute h-3 w-2 rounded-sm"
                style={{ backgroundColor: piece.color, left: `${piece.x}%` }}
                initial={{ y: -20, rotate: 0, opacity: 1 }}
                animate={{ y: '120vh', rotate: piece.rotation + 720, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 + Math.random(), delay: piece.delay, ease: 'easeIn' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Loot Box */}
      <AnimatePresence>
        {showLootBox && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4 rounded-3xl border border-yellow-500/30 bg-gradient-to-b from-gray-900 to-gray-800 p-8 text-center shadow-2xl"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="text-6xl"
                animate={{ rotate: [-5, 5, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                🎁
              </motion.div>
              <h2 className="text-xl font-bold text-yellow-400">Loot Box Unlocked!</h2>
              <p className="text-sm text-gray-400">5 green choices in a row!</p>
              <motion.div
                className="mt-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-lg font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {earnedBadge}
              </motion.div>
              <button
                onClick={() => setShowLootBox(false)}
                className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
