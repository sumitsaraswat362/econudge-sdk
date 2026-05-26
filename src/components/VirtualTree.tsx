'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  healthRatio: number; // 0 to 1
}

function getTier(ratio: number) {
  if (ratio >= 0.7) return { name: 'Forest', emoji: '🌲', color: '#10b981' };
  if (ratio >= 0.4) return { name: 'Tree', emoji: '🌳', color: '#34d399' };
  if (ratio >= 0.2) return { name: 'Sapling', emoji: '🌿', color: '#6ee7b7' };
  return { name: 'Seed', emoji: '🌰', color: '#a1a1aa' };
}

export default function VirtualTree({ healthRatio }: Props) {
  const tier = getTier(healthRatio);
  const leafCount = Math.floor(healthRatio * 20);
  const trunkHeight = 40 + healthRatio * 80;

  const leaves = useMemo(() => {
    return Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 60,
      y: -(Math.random() * (trunkHeight * 0.8) + 20),
      size: 8 + Math.random() * 16,
      delay: i * 0.08,
      hue: 120 + Math.random() * 40,
    }));
  }, [leafCount, trunkHeight]);

  return (
    <div className="relative flex flex-col items-center justify-end p-6" style={{ minHeight: 260 }}>
      {/* Sky glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: healthRatio > 0.5
            ? 'radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(100,100,100,0.05) 0%, transparent 70%)',
        }}
        transition={{ duration: 2 }}
      />

      {/* Floating particles for Forest tier */}
      {healthRatio >= 0.7 && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`bird-${i}`}
              className="absolute text-xs"
              initial={{ x: -20, y: 40 + i * 15 }}
              animate={{ x: [null, 150, -20], y: [null, 30 + i * 10, 40 + i * 15] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5 }}
            >
              {i % 2 === 0 ? '🐦' : '✨'}
            </motion.div>
          ))}
        </>
      )}

      {/* Leaves */}
      <svg className="absolute bottom-12 left-1/2 -translate-x-1/2" width="200" height="200" viewBox="-100 -200 200 200" overflow="visible">
        {leaves.map((leaf) => (
          <motion.circle
            key={leaf.id}
            cx={leaf.x}
            cy={leaf.y}
            r={leaf.size / 2}
            fill={`hsla(${leaf.hue}, 70%, ${45 + healthRatio * 15}%, 0.7)`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: leaf.delay, duration: 0.5, type: 'spring' }}
          />
        ))}
      </svg>

      {/* Trunk */}
      <motion.div
        className="relative z-10 rounded-t-md"
        style={{
          width: 8 + healthRatio * 12,
          backgroundColor: healthRatio > 0.2 ? '#6b4423' : '#71717a',
        }}
        animate={{ height: trunkHeight }}
        transition={{ duration: 1, type: 'spring' }}
      />

      {/* Ground */}
      <div className="relative z-10 h-2 w-24 rounded-full" style={{
        background: healthRatio > 0.3
          ? 'linear-gradient(90deg, #065f46, #047857, #065f46)'
          : 'linear-gradient(90deg, #52525b, #71717a, #52525b)',
      }} />

      {/* Tier badge */}
      <motion.div
        className="mt-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold"
        style={{ background: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.color}44` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>{tier.emoji}</span>
        <span>{tier.name}</span>
      </motion.div>
    </div>
  );
}
