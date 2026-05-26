'use client';

import { motion } from 'framer-motion';
import { useImpact } from '@/context/ImpactContext';
import VirtualTree from '@/components/VirtualTree';
import CityWars from '@/components/CityWars';
import StreakTracker from '@/components/StreakTracker';
import { predictLifetimeImpact } from '@/lib/predictor';
import { getAnalogy } from '@/lib/analogies';
import { useState, useRef, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */
function useAnimatedCounter(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) { setValue(target); return; }

    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + diff * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    prevTarget.current = target;
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Impact stat card                                                   */
/* ------------------------------------------------------------------ */
function ImpactCard({ icon, value, unit, label, delay, isFloat = false }: {
  icon: string; value: number; unit: string; label: string; delay: number; isFloat?: boolean;
}) {
  const animated = useAnimatedCounter(value);
  const displayValue = isFloat ? animated.toFixed(2) : Math.round(animated).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="glass-card-light flex flex-col items-center gap-1 p-6"
    >
      <span className="text-3xl mb-1">{icon}</span>
      <p className="text-2xl font-bold text-white">
        {displayValue}
        <span className="ml-1 text-xs font-normal text-gray-400">{unit}</span>
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.div>
  );
}

export default function ImpactPage() {
  const { impactStats } = useImpact();
  const [aiReport, setAiReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const healthRatio = Math.min(impactStats.decisionsOverridden / 5, 1);
  const prediction = predictLifetimeImpact(impactStats.totalCo2Saved, impactStats.decisionsOverridden);
  const analogy = impactStats.totalCo2Saved > 0 ? getAnalogy(impactStats.totalCo2Saved) : '';

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          Your <span className="gradient-text">Impact Dashboard</span>
        </h1>
        <p className="mb-10 text-center text-sm text-gray-500">
          See the positive difference you're making with EcoNudge
        </p>

        {/* Streak Tracker */}
        <div className="mb-8 flex justify-center">
          <StreakTracker streakCount={impactStats.decisionsOverridden} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <ImpactCard icon="🌫️" value={impactStats.totalCo2Saved} unit="g" label="CO₂ Saved" delay={0.1} />
          <ImpactCard icon="💧" value={impactStats.totalWaterSaved} unit="L" label="Water Conserved" delay={0.2} />
          <ImpactCard icon="🌳" value={impactStats.treesEquivalent} unit="" label="Trees Equivalent" delay={0.3} isFloat />
          <ImpactCard icon="⭐" value={impactStats.totalEcoPoints} unit="pts" label="EcoPoints" delay={0.4} />
        </div>

        {/* Analogy */}
        {analogy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center text-sm text-emerald-300"
          >
            💡 <strong>Did you know?</strong> {analogy}
          </motion.div>
        )}

        {/* Two-column layout: Tree + Prediction */}
        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          {/* Virtual Tree */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <h3 className="mb-2 text-center text-sm font-bold text-white">🌱 Your EcoTree</h3>
            <VirtualTree healthRatio={healthRatio} />
          </motion.div>

          {/* Predictive Carbon Modeling */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="mb-4 text-sm font-bold text-white">🔮 Carbon Trajectory</h3>
            <div className="space-y-3">
              {[
                { label: 'Daily Savings', value: `${prediction.dailyEstimate}g`, icon: '📅' },
                { label: 'Monthly Savings', value: `${prediction.monthlyEstimate}g`, icon: '🗓️' },
                { label: 'Yearly Savings', value: `${prediction.yearlyEstimate}kg`, icon: '📊' },
                { label: '5-Year Projection', value: `${prediction.fiveYearEstimate}kg`, icon: '🚀' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-sm text-gray-400">{item.icon} {item.label}</span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>

            <div className={`mt-4 rounded-xl p-3 text-sm ${
              prediction.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-300' :
              prediction.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-300' :
              prediction.riskLevel === 'high' ? 'bg-orange-500/10 text-orange-300' :
              'bg-red-500/10 text-red-300'
            }`}>
              {prediction.warningMessage}
            </div>
          </motion.div>
        </div>

        {/* City Wars and AI Report Row */}
        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <CityWars />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 flex flex-col relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <span className="text-3xl">🤖</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generative AI Green Report</h3>
            </div>
            
            {!aiReport ? (
              <div className="flex flex-col items-center justify-center text-center flex-1 relative z-10 py-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Get a personalized, long-form analysis of your environmental impact generated by the EcoNudge LLM.
                </p>
                <button
                  onClick={() => {
                    setIsGenerating(true);
                    setAiReport('');
                    const text = `Analyzing your choices...\n\nYou are showing excellent promise! With ${impactStats.totalCo2Saved}g CO2 saved, your choices indicate a strong preference for sustainable transport. By opting for the metro instead of cabs, you've reduced your footprint significantly. Keep focusing on reducing your single-use plastics to reach the Forest tier faster!`;
                    
                    let i = 0;
                    const interval = setInterval(() => {
                      setAiReport(text.slice(0, i));
                      i++;
                      if (i > text.length) {
                        clearInterval(interval);
                        setIsGenerating(false);
                      }
                    }, 30);
                  }}
                  disabled={isGenerating}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Report ✨'}
                </button>
              </div>
            ) : (
              <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {aiReport}
                  {isGenerating && <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse" />}
                </p>
                {!isGenerating && (
                  <button 
                    onClick={() => setAiReport('')}
                    className="mt-4 text-xs font-bold text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Reset Report
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {impactStats.decisionsOverridden === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6 text-center"
          >
            <p className="text-gray-400">You haven't made any green choices yet.</p>
            <p className="mt-2 text-sm text-gray-500">Head over to the Live Demo and select a greener alternative to start tracking!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-eco-green/20 bg-eco-green/5 p-6"
          >
            <span className="pulse-green inline-block h-3 w-3 rounded-full bg-eco-green" />
            <p className="text-lg text-gray-300">
              You have made{' '}
              <span className="text-2xl font-bold text-eco-green">{impactStats.decisionsOverridden}</span>{' '}
              greener {impactStats.decisionsOverridden === 1 ? 'choice' : 'choices'} today!
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
