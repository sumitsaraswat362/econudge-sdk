'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImpact } from '@/context/ImpactContext';
import confetti from 'canvas-confetti';

const projects = [
  {
    id: 1,
    title: 'Amazon Reforestation',
    org: 'Rainforest Trust',
    description: 'Planting native trees in deforested areas of the Brazilian Amazon to restore wildlife habitats.',
    cost: 500,
    icon: '🌳',
    color: 'from-emerald-500 to-green-600',
    progress: 78
  },
  {
    id: 2,
    title: 'Ocean Plastic Cleanup',
    org: 'Ocean Conservancy',
    description: 'Deploying autonomous solar-powered ships to collect microplastics from the Great Pacific Garbage Patch.',
    cost: 300,
    icon: '🌊',
    color: 'from-blue-500 to-cyan-600',
    progress: 45
  },
  {
    id: 3,
    title: 'Solar Microgrids in Kenya',
    org: 'SolarAid',
    description: 'Providing clean, renewable solar energy to off-grid rural communities to replace kerosene lamps.',
    cost: 800,
    icon: '☀️',
    color: 'from-yellow-400 to-orange-500',
    progress: 92
  },
  {
    id: 4,
    title: 'Wind Farm Expansion',
    org: 'Clean Energy Co',
    description: 'Funding the construction of 5 new onshore wind turbines to power 10,000 homes.',
    cost: 1200,
    icon: '💨',
    color: 'from-purple-500 to-indigo-600',
    progress: 15
  }
];

export default function MarketplacePage() {
  const { impactStats } = useImpact();
  // We use local state to mock spending points just for the demo
  const [points, setPoints] = useState(impactStats.totalEcoPoints);
  const [funded, setFunded] = useState<number[]>([]);

  const handleFund = (id: number, cost: number) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setFunded(prev => [...prev, id]);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl mb-2">
              Offset <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-sm text-gray-500">
              Spend your earned EcoPoints to fund real-world verified sustainability projects.
            </p>
          </div>
          
          <div className="glass-card px-6 py-3 flex items-center gap-3 border-emerald-500/30 bg-emerald-500/10">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-xs text-gray-400 font-medium">Your Balance</p>
              <p className="text-2xl font-bold text-emerald-400">{points.toLocaleString()} pts</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => {
            const isFunded = funded.includes(project.id);
            const canAfford = points >= project.cost;

            return (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden flex flex-col relative"
              >
                {/* Header Graphic */}
                <div className={`h-24 bg-gradient-to-r ${project.color} opacity-20 relative`} />
                <div className="absolute top-6 right-6 text-4xl">{project.icon}</div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <p className="text-xs font-semibold text-emerald-400 mb-3">{project.org}</p>
                  <p className="text-sm text-gray-400 flex-1">{project.description}</p>
                  
                  {/* Funding Progress Bar */}
                  <div className="mt-4 mb-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Global Funding Progress</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${project.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {isFunded ? (
                    <div className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2">
                      <span>✅</span> Project Funded!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFund(project.id, project.cost)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                        canAfford 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                          : 'bg-white/5 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Fund for {project.cost} pts
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
