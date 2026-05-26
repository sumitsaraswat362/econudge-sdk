'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { ImpactStats, GreenAlternative } from '@/lib/types';

interface ImpactContextType {
  impactStats: ImpactStats;
  handleSelectAlternative: (alt: GreenAlternative) => void;
}

const ImpactContext = createContext<ImpactContextType | undefined>(undefined);

export function ImpactProvider({ children }: { children: ReactNode }) {
  const [impactStats, setImpactStats] = useState<ImpactStats>({
    totalCo2Saved: 0,
    totalWaterSaved: 0,
    totalEnergySaved: 0,
    totalEcoPoints: 0,
    decisionsOverridden: 0,
    treesEquivalent: 0,
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('econudge_impact_stats');
    if (saved) {
      try {
        setImpactStats(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse impact stats', e);
      }
    }
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('econudge_impact_stats', JSON.stringify(impactStats));
  }, [impactStats]);

  const handleSelectAlternative = useCallback((alt: GreenAlternative) => {
    setImpactStats((prev) => ({
      totalCo2Saved: prev.totalCo2Saved + alt.co2Saved,
      totalWaterSaved: prev.totalWaterSaved + alt.waterSaved,
      totalEnergySaved: prev.totalEnergySaved + alt.energySaved,
      totalEcoPoints: prev.totalEcoPoints + alt.ecoPoints,
      decisionsOverridden: prev.decisionsOverridden + 1,
      treesEquivalent: parseFloat(
        (prev.treesEquivalent + alt.co2Saved / 22000).toFixed(3)
      ),
    }));
  }, []);

  return (
    <ImpactContext.Provider value={{ impactStats, handleSelectAlternative }}>
      {children}
    </ImpactContext.Provider>
  );
}

export function useImpact() {
  const context = useContext(ImpactContext);
  if (context === undefined) {
    throw new Error('useImpact must be used within an ImpactProvider');
  }
  return context;
}
