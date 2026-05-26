'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
  ecoPoints: number;
  actionTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarbonReceipt({ co2Saved, waterSaved, energySaved, ecoPoints, actionTitle, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const items = [
    { label: 'CO₂ Emissions Saved', value: `${co2Saved}g`, icon: '🌫️' },
    { label: 'Water Conserved', value: `${waterSaved}L`, icon: '💧' },
    { label: 'Energy Saved', value: `${energySaved}kWh`, icon: '⚡' },
    { label: 'EcoPoints Earned', value: `+${ecoPoints}`, icon: '⭐' },
  ];

  const treesEquiv = (co2Saved / 22000).toFixed(3);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Receipt header dashed line */}
            <div className="border-b-2 border-dashed border-gray-700 px-6 pt-6 pb-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="pulse-green inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">EcoNudge</span>
              </div>
              <h2 className="text-xl font-bold text-white">Carbon Receipt</h2>
              <p className="mt-1 text-xs text-gray-500">{new Date().toLocaleString()}</p>
            </div>

            {/* Action */}
            <div className="px-6 py-3 text-center">
              <p className="text-xs text-gray-500">Green Choice Made</p>
              <p className="text-sm font-semibold text-white">{actionTitle}</p>
            </div>

            <div className="border-t border-dashed border-gray-700" />

            {/* Line items */}
            <div className="space-y-3 px-6 py-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-emerald-400">{item.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-700" />

            {/* Total */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">🌳 Trees Equivalent</span>
                <span className="text-lg font-bold gradient-text">{treesEquiv}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-700" />

            {/* QR + share */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="grid h-12 w-12 grid-cols-3 grid-rows-3 gap-0.5 rounded-lg bg-white p-1.5">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[1px]"
                    style={{ background: Math.random() > 0.3 ? '#111' : '#fff' }}
                  />
                ))}
              </div>
              <button
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
                onClick={() => alert('📸 Instagram share coming soon!')}
              >
                Share to Instagram 📸
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-full border-t border-gray-800 py-3 text-sm text-gray-500 transition hover:text-white"
            >
              Close Receipt
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
