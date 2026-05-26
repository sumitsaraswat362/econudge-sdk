// Live Traffic Emission Simulation Engine
// Dynamically adjusts CO2 estimates based on time-of-day traffic patterns

export function getTrafficMultiplier(hour: number): { multiplier: number; level: string } {
  // Morning rush: 7-10 AM
  if (hour >= 7 && hour < 10) return { multiplier: 1.8, level: 'Heavy Traffic 🔴' };
  // Evening rush: 5-8 PM
  if (hour >= 17 && hour < 20) return { multiplier: 1.9, level: 'Heavy Traffic 🔴' };
  // Moderate: 10 AM - 5 PM
  if (hour >= 10 && hour < 17) return { multiplier: 1.2, level: 'Moderate Traffic 🟡' };
  // Late night: 11 PM - 5 AM
  if (hour >= 23 || hour < 5) return { multiplier: 0.6, level: 'Clear Roads 🟢' };
  // Early morning / late evening
  return { multiplier: 0.9, level: 'Light Traffic 🟢' };
}

export function getDynamicEmissions(baseEmissionsPerKm: number, distanceKm: number) {
  const now = new Date();
  const hour = now.getHours();
  const { multiplier, level } = getTrafficMultiplier(hour);

  // Idling penalty: extra 15g/km during heavy traffic due to stop-and-go
  const idlingPenalty = multiplier > 1.5 ? 15 * distanceKm : 0;

  const emissions = Math.round(baseEmissionsPerKm * distanceKm * multiplier + idlingPenalty);

  return {
    emissions,
    trafficLevel: level,
    idlingPenalty: Math.round(idlingPenalty),
    multiplier,
    timeOfDay: `${hour}:00`,
  };
}
