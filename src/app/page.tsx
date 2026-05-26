'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Step card (How It Works)                                           */
/* ------------------------------------------------------------------ */
function StepCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.18 }}
      className="glass-card spotlight-card glow-green group relative flex flex-col items-center p-8 text-center transition-transform hover:scale-[1.03]"
    >
      <div className="absolute top-4 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-eco-green text-xs font-bold text-white">
        {index + 1}
      </div>
      <span className="mb-4 text-5xl">{icon}</span>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat pill (hero)                                                   */
/* ------------------------------------------------------------------ */
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card-light spotlight-card flex flex-col items-center px-5 py-3 sm:px-8">
      <span className="gradient-text text-xl font-bold sm:text-2xl">{value}</span>
      <span className="mt-0.5 text-xs text-gray-400">{label}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col">
      {/* ========================================================= */}
      {/*  HERO                                                      */}
      {/* ========================================================= */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-eco-green/20 bg-eco-green/10 px-4 py-1.5 text-sm text-eco-green"
        >
          <span className="pulse-green inline-block h-2 w-2 rounded-full bg-eco-green" />
          GreenHack 2026 — Live Demo
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="gradient-text glow-text max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl"
          style={{ fontFamily: 'var(--font-space), sans-serif' }}
        >
          EcoNudge SDK
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-4 max-w-xl text-lg text-gray-300 sm:text-xl"
        >
          The sustainability layer for every digital platform
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 max-w-lg text-sm leading-relaxed text-gray-500"
        >
          A drop-in widget and API that intercepts user decisions at the point of action,
          providing real-time green alternatives without friction.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-8"
        >
          <Link href="/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary pulse-green text-base"
            >
              Try the Demo →
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <HeroStat value="192g" label="CO₂/km saved" />
          <HeroStat value="3" label="Platforms integrated" />
          <HeroStat value="< 50ms" label="Latency" />
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/*  HOW IT WORKS                                              */}
      {/* ========================================================= */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 mb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-14 text-center text-3xl font-bold text-white sm:text-4xl"
        >
          How It <span className="gradient-text">Works</span>
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <StepCard
            icon="🔌"
            title="Integrate"
            desc="Add EcoNudge SDK to your platform's checkout flow with a single React component."
            index={0}
          />
          <StepCard
            icon="🧠"
            title="Intercept"
            desc="Our Decision Engine analyzes the user's action and calculates its carbon footprint in real-time."
            index={1}
          />
          <StepCard
            icon="🌱"
            title="Nudge"
            desc="A beautiful, non-intrusive widget suggests greener alternatives with gamified rewards."
            index={2}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/*  FOOTER                                                    */}
      {/* ========================================================= */}
      <footer className="border-t border-white/5 py-10 text-center text-sm text-gray-600 mt-auto">
        <p>
          Built with 💚 by <span className="font-semibold text-eco-green">Sumit Saraswat</span> for{' '}
          <span className="font-semibold text-eco-green">GreenHack 2026</span>
        </p>
        <p className="mt-1 text-xs text-gray-700">
          EcoNudge SDK • React • Next.js • Framer Motion
        </p>
      </footer>
    </main>
  );
}
