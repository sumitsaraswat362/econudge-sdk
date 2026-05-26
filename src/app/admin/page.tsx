'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ESGReport {
  companyName: string;
  reportDate: string;
  reportId: string;
  totalCarbonOffsetKg: number;
  totalUsersReached: number;
  averageConversionRate: number;
  nudgesDelivered: number;
  topPlatforms: { name: string; co2SavedKg: number; usersReached: number; conversionRate: number }[];
  sdgAlignment: { goal: string; name: string; score: number }[];
  monthlyTrend: { month: string; co2SavedKg: number }[];
  certificationReady: boolean;
  complianceStandards: string[];
}

function StatCard({ label, value, subtext, icon, delay }: {
  label: string; value: string; subtext?: string; icon: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card-light p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="mt-0.5 text-xs text-emerald-400">{subtext}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [report, setReport] = useState<ESGReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/esg/report')
      .then((r) => r.json())
      .then((data) => { setReport(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="relative z-10 flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="shimmer mx-auto h-12 w-12 rounded-full bg-white/10" />
          <p className="mt-4 text-sm text-gray-500">Loading ESG Report...</p>
        </div>
      </main>
    );
  }

  if (!report) return null;

  const maxTrend = Math.max(...report.monthlyTrend.map((m) => m.co2SavedKg));

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Corporate <span className="gradient-text">Admin</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">ESG Compliance Dashboard • Report ID: {report.reportId}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2">
            <span className="pulse-green inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">LIVE</span>
          </div>
        </div>

        {/* Top-level KPIs */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <StatCard icon="🌍" label="Total Carbon Offset" value={`${(report.totalCarbonOffsetKg / 1000).toFixed(0)}t`} subtext="tonnes CO₂" delay={0.1} />
          <StatCard icon="👥" label="Users Reached" value={report.totalUsersReached.toLocaleString()} delay={0.15} />
          <StatCard icon="📊" label="Conversion Rate" value={`${(report.averageConversionRate * 100).toFixed(1)}%`} subtext="green choices" delay={0.2} />
          <StatCard icon="🔔" label="Nudges Delivered" value={`${(report.nudgesDelivered / 1000000).toFixed(1)}M`} delay={0.25} />
        </div>

        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card mb-8 p-6"
        >
          <h3 className="mb-4 text-sm font-bold text-white">📈 Monthly CO₂ Offset Trend</h3>
          <div className="flex items-end gap-3 h-40">
            {report.monthlyTrend.map((m, i) => {
              const pct = (m.co2SavedKg / maxTrend) * 100;
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-gray-400">{(m.co2SavedKg / 1000).toFixed(0)}t</span>
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{ background: 'linear-gradient(180deg, #10b981, #059669)' }}
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  />
                  <span className="text-[10px] text-gray-500">{m.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card mb-8 p-6"
        >
          <h3 className="mb-4 text-sm font-bold text-white">🏢 Platform Performance</h3>
          <div className="space-y-4">
            {report.topPlatforms.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-white">{p.name}</span>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: i === 0 ? 'linear-gradient(90deg, #3b82f6, #2563eb)' :
                          i === 1 ? 'linear-gradient(90deg, #f97316, #ea580c)' :
                            'linear-gradient(90deg, #a855f7, #7c3aed)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.co2SavedKg / report.topPlatforms[0].co2SavedKg) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400">{(p.co2SavedKg / 1000).toFixed(0)}t</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom row: SDG + Compliance */}
        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6"
          >
            <h3 className="mb-4 text-sm font-bold text-white">🎯 SDG Alignment</h3>
            <div className="space-y-3">
              {report.sdgAlignment.map((sdg) => (
                <div key={sdg.goal} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white">{sdg.goal}</span>
                    <p className="text-xs text-gray-500">{sdg.name}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{(sdg.score * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6"
          >
            <h3 className="mb-4 text-sm font-bold text-white">✅ Compliance Standards</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {report.complianceStandards.map((std) => (
                <span key={std} className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                  {std}
                </span>
              ))}
            </div>
            <div className={`rounded-xl p-3 text-sm ${report.certificationReady ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
              {report.certificationReady ? '✅ Certification-ready for ESG audit' : '⚠️ Pending compliance review'}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
