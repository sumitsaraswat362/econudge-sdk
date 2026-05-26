// Predictive Carbon Modeling
// Extrapolates current session behavior into lifetime carbon trajectory

export interface CarbonPrediction {
  dailyEstimate: number;    // grams
  monthlyEstimate: number;
  yearlyEstimate: number;   // kg
  fiveYearEstimate: number; // kg
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  warningMessage: string;
  treesNeeded: number;
}

export function predictLifetimeImpact(
  currentSessionCo2Saved: number,
  decisionsCount: number
): CarbonPrediction {
  if (decisionsCount === 0) {
    return {
      dailyEstimate: 0,
      monthlyEstimate: 0,
      yearlyEstimate: 0,
      fiveYearEstimate: 0,
      riskLevel: 'critical',
      warningMessage: 'You haven\'t made any green choices yet. The average person emits 4,000kg CO₂ per year from daily decisions.',
      treesNeeded: 182,
    };
  }

  // Average CO2 saved per decision
  const avgSavedPerDecision = currentSessionCo2Saved / decisionsCount;

  // Assume 8 decisions per day on average (rides, meals, shopping)
  const dailySavings = avgSavedPerDecision * 8;
  const monthlySavings = dailySavings * 30;
  const yearlySavings = Math.round(dailySavings * 365 / 1000); // convert to kg
  const fiveYearSavings = yearlySavings * 5;

  // Trees needed: 1 tree absorbs ~22kg CO2/year
  const treesNeeded = Math.ceil(yearlySavings / 22);

  let riskLevel: CarbonPrediction['riskLevel'];
  let warningMessage: string;

  if (yearlySavings > 500) {
    riskLevel = 'low';
    warningMessage = `🌟 Amazing! At this rate, you'll save ${fiveYearSavings}kg CO₂ in 5 years — equivalent to planting ${treesNeeded * 5} trees!`;
  } else if (yearlySavings > 200) {
    riskLevel = 'medium';
    warningMessage = `👍 Good progress! You're on track to save ${yearlySavings}kg CO₂ per year. Keep choosing green alternatives to level up!`;
  } else if (yearlySavings > 50) {
    riskLevel = 'high';
    warningMessage = `⚠️ You could do better. At this rate, you'll only save ${yearlySavings}kg CO₂ per year. Try accepting more green alternatives!`;
  } else {
    riskLevel = 'critical';
    warningMessage = `🚨 Critical! You're barely making an impact. The average person needs to offset at least 200kg/year. Step up your green game!`;
  }

  return {
    dailyEstimate: Math.round(dailySavings),
    monthlyEstimate: Math.round(monthlySavings),
    yearlyEstimate: yearlySavings,
    fiveYearEstimate: fiveYearSavings,
    riskLevel,
    warningMessage,
    treesNeeded,
  };
}
