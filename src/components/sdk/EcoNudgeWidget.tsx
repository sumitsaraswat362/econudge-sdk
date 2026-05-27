'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NudgeCard from './NudgeCard';
import { playSuccessChime } from '@/lib/audio';
import type { UserAction, GreenAlternative, NudgeResponse } from '@/lib/types';

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Props                                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */
interface EcoNudgeWidgetProps {
  action: UserAction;
  isOpen: boolean;
  onClose: () => void;
  onAlternativeSelected: (alt: GreenAlternative) => void;
}

/* ── Pulsing skeleton loader ─────────────────────────────────────────────── */
function PulseLoader() {
  return (
    <div className="flex flex-col items-center gap-6 py-14">
      {/* Animated leaf icon */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl"
      >
        🌱
      </motion.div>

      {/* Shimmer bars */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        {[1, 0.8, 0.6].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
            className="h-3 rounded-full bg-emerald-400/20"
            style={{ width: `${w * 100}%` }}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-white/40">
        Calculating your carbon footprint…
      </p>
    </div>
  );
}

/* ── Stat pill ───────────────────────────────────────────────────────────── */
function StatPill({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-2 sm:px-5 py-2 sm:py-3 text-center">
      <span className="text-lg sm:text-xl">{emoji}</span>
      <span className="text-sm sm:text-base font-bold tracking-tight text-white">
        {value}
      </span>
      <span className="text-[10px] sm:text-[11px] font-medium text-white/40 leading-tight">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  EcoNudgeWidget                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function EcoNudgeWidget({
  action,
  isOpen,
  onClose,
  onAlternativeSelected,
}: EcoNudgeWidgetProps) {
  const [nudge, setNudge] = useState<NudgeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch nudge data when modal opens ─────────────────────────────────── */
  const fetchNudge = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNudge(null);

    try {
      const res = await fetch('/api/nudge/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      if (!res.ok) throw new Error(`API returned ${res.status}`);

      const data: NudgeResponse = await res.json();
      setNudge(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [action]);

  const handleAlternativeSelected = (alt: GreenAlternative) => {
    playSuccessChime();
    onAlternativeSelected(alt);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNudge();
    } else {
      setNudge(null);
      setLoading(false);
      setError(null);
    }
  }, [isOpen, fetchNudge]);

  /* ── Close on Escape ───────────────────────────────────────────────────── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, onClose]);

  /* ── Derived helpers ───────────────────────────────────────────────────── */
  const co2Display = nudge
    ? nudge.currentImpact.co2Grams >= 1000
      ? `${(nudge.currentImpact.co2Grams / 1000).toFixed(2)}`
      : `${nudge.currentImpact.co2Grams}`
    : '—';

  const co2Unit = nudge
    ? nudge.currentImpact.co2Grams >= 1000
      ? 'kg CO₂'
      : 'g CO₂'
    : '';

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Overlay ─────────────────────────────────────────────── */
        <motion.div
          key="eco-nudge-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* ── Modal panel ──────────────────────────────────────── */}
          <motion.div
            key="eco-nudge-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl shadow-emerald-500/5"
          >
            {/* Top glow line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

            {/* Scrollable content */}
            <div className="max-h-[85vh] overflow-y-auto px-6 pb-8 pt-6 sm:px-8">
              {/* ── Branding ─────────────────────────────────────── */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold tracking-wide text-white/70">
                  🌱 EcoNudge
                </span>
              </div>

              {/* ── Loading state ────────────────────────────────── */}
              {loading && <PulseLoader />}

              {/* ── Error state ──────────────────────────────────── */}
              {error && (
                <div className="mt-8 flex flex-col items-center gap-4 py-8">
                  <span className="text-4xl">⚠️</span>
                  <p className="text-sm text-red-300">{error}</p>
                  <button
                    onClick={fetchNudge}
                    className="cursor-pointer rounded-xl bg-white/10 px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* ── Nudge content ────────────────────────────────── */}
              {nudge && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {/* Carbon footprint hero */}
                  <div className="mt-6 text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                      Your Carbon Footprint
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      {/* CO₂ cloud icon */}
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white/20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <path d="M4.5 13.5C2.567 13.5 1 11.933 1 10c0-1.655 1.15-3.043 2.694-3.408C4.357 4.505 6.36 3 8.75 3c2.068 0 3.837 1.143 4.773 2.83A4.5 4.5 0 0120 10.5c0 1.17-.447 2.236-1.18 3.035A3.5 3.5 0 0115.5 17h-9A3.5 3.5 0 013 13.5h1.5z" />
                      </motion.svg>
                      <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
                        {co2Display}
                      </span>
                      <span className="mt-1 text-lg font-medium text-white/40">
                        {co2Unit}
                      </span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mt-5 grid grid-cols-3 gap-2.5">
                    <StatPill
                      emoji="🌳"
                      label="Trees needed"
                      value={nudge.treesEquivalent.toFixed(1)}
                    />
                    <StatPill
                      emoji="💧"
                      label="Water (L)"
                      value={nudge.currentImpact.waterLiters.toFixed(0)}
                    />
                    <StatPill
                      emoji="⚡"
                      label="Energy (kWh)"
                      value={nudge.currentImpact.energyKwh.toFixed(1)}
                    />
                  </div>

                  {/* Fun fact */}
                  <div className="mt-5 rounded-2xl border border-sky-500/15 bg-sky-500/[0.06] px-4 py-3">
                    <p className="text-xs leading-relaxed text-sky-200/80">
                      <span className="mr-1.5 font-semibold text-sky-300">
                        💡 Did you know?
                      </span>
                      {nudge.funFact}
                    </p>
                  </div>

                  {/* Alternatives heading */}
                  <div className="mt-7 mb-4">
                    <h3 className="text-sm font-semibold tracking-wide text-white/80">
                      🌿 Greener Alternatives
                    </h3>
                    <p className="mt-0.5 text-xs text-white/35">
                      Choose a more sustainable option below
                    </p>
                  </div>

                  {/* NudgeCards */}
                  <div className="flex flex-col gap-3">
                    {nudge.alternatives.map((alt, i) => (
                      <NudgeCard
                        key={alt.id}
                        alternative={alt}
                        index={i}
                        onSelect={handleAlternativeSelected}
                      />
                    ))}
                  </div>

                  {/* Continue anyway */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <p className="text-[11px] text-white/25">
                      Powered by EcoNudge SDK
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={onClose}
                      className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-white/30 transition-colors hover:text-white/50"
                    >
                      Continue Anyway
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
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
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
