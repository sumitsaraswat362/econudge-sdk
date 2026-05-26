'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const cities = [
  { name: 'Bangalore', flag: '🇮🇳', co2Saved: 0, users: 0 },
  { name: 'Mumbai', flag: '🇮🇳', co2Saved: 0, users: 0 },
  { name: 'Delhi', flag: '🇮🇳', co2Saved: 0, users: 0 },
  { name: 'Chennai', flag: '🇮🇳', co2Saved: 0, users: 0 },
  { name: 'Berlin', flag: '🇩🇪', co2Saved: 0, users: 0 },
  { name: 'New York', flag: '🇺🇸', co2Saved: 0, users: 0 },
  { name: 'Tokyo', flag: '🇯🇵', co2Saved: 0, users: 0 },
  { name: 'London', flag: '🇬🇧', co2Saved: 0, users: 0 },
];

function seedCities() {
  return cities.map((c) => ({
    ...c,
    co2Saved: Math.floor(Math.random() * 49500) + 500,
    users: Math.floor(Math.random() * 4900) + 100,
  })).sort((a, b) => b.co2Saved - a.co2Saved);
}

export default function CityWars() {
  const rankedCities = useMemo(() => seedCities(), []);
  const maxCo2 = rankedCities[0].co2Saved;

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-bold text-white">
        <span>⚔️</span> City Wars
        <span className="ml-auto text-xs font-normal text-gray-500">Live Competition</span>
      </h3>

      {rankedCities.map((city, i) => {
        const pct = (city.co2Saved / maxCo2) * 100;
        const isFirst = i === 0;

        return (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-xl p-3 transition ${
              isFirst
                ? 'border border-yellow-500/30 bg-yellow-500/5'
                : 'border border-white/5 bg-white/[0.03]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                isFirst ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'
              }`}>
                {i + 1}
              </span>
              <span className="text-lg">{city.flag}</span>
              <span className="font-medium text-white">{city.name}</span>
              <span className="ml-auto text-xs text-gray-500">{city.users.toLocaleString()} users</span>
              <span className="font-bold text-emerald-400">{(city.co2Saved / 1000).toFixed(1)}kg</span>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isFirst
                    ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                    : 'linear-gradient(90deg, #10b981, #14b8a6)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
