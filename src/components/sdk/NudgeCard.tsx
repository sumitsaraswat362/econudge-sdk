'use client';

import { motion } from 'framer-motion';
import type { GreenAlternative } from '@/lib/types';

interface NudgeCardProps {
  alternative: GreenAlternative;
  index: number;
  onSelect: (alt: GreenAlternative) => void;
}

/* ── Circular sustainability score ring ──────────────────────────────────── */
function SustainabilityRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[11px] font-bold text-emerald-300">{score}</span>
    </div>
  );
}

/* ── Badge helper ────────────────────────────────────────────────────────── */
function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'green' | 'amber' | 'red' | 'violet' | 'sky';
}) {
  const colorMap: Record<string, string> = {
    green: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25',
    amber: 'bg-amber-500/15 text-amber-300 ring-amber-500/25',
    red: 'bg-red-500/15 text-red-300 ring-red-500/25',
    violet: 'bg-violet-500/15 text-violet-300 ring-violet-500/25',
    sky: 'bg-sky-500/15 text-sky-300 ring-sky-500/25',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${colorMap[variant]}`}
    >
      {children}
    </span>
  );
}

/* ── Cost badge ──────────────────────────────────────────────────────────── */
function CostBadge({ costDifference }: { costDifference: string }) {
  const isSaving = costDifference.startsWith('-');
  const isFree = costDifference === '₹0' || costDifference === '$0' || costDifference === '0';

  if (isFree) {
    return <Badge variant="green">💰 Same cost</Badge>;
  }
  return (
    <Badge variant={isSaving ? 'green' : 'red'}>
      💰 {isSaving ? `Save ${costDifference.slice(1)}` : costDifference}
    </Badge>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  NudgeCard                                                               */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function NudgeCard({ alternative, index, onSelect }: NudgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.12 * index,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.03 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.06] p-5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)]"
    >
      {/* Subtle top-edge glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-2xl shadow-inner">
          {alternative.icon}
        </div>

        {/* Title + description */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold leading-snug text-white/90">
            {alternative.title}
          </h4>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/50">
            {alternative.description}
          </p>
        </div>

        {/* Sustainability ring */}
        <SustainabilityRing score={alternative.sustainabilityScore} />
      </div>

      {/* ── Badges ─────────────────────────────────────────────── */}
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <Badge variant="green">
          🌿 {(alternative.co2Saved / 1000).toFixed(1)}kg CO₂
        </Badge>
        {alternative.waterSaved > 0 && (
          <Badge variant="sky">
            💧 {alternative.waterSaved.toFixed(0)}L
          </Badge>
        )}
        <Badge variant="amber">
          ⏱ {alternative.convenienceTradeoff}
        </Badge>
        <CostBadge costDifference={alternative.costDifference} />
        <Badge variant="violet">
          ⭐ {alternative.ecoPoints} pts
        </Badge>
      </div>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect(alternative)}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 hover:brightness-110 active:brightness-95"
      >
        <span>Choose This</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}
