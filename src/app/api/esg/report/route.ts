import { NextResponse } from 'next/server';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET() {
  const report = {
    companyName: 'EcoNudge Partners Network',
    reportDate: new Date().toISOString().split('T')[0],
    reportId: `ESG-${Date.now().toString(36).toUpperCase()}`,
    totalCarbonOffsetKg: randomInt(50000, 200000),
    totalUsersReached: randomInt(100000, 500000),
    averageConversionRate: parseFloat((Math.random() * 0.33 + 0.34).toFixed(3)),
    nudgesDelivered: randomInt(500000, 2000000),
    topPlatforms: [
      { name: 'QuickRide', co2SavedKg: randomInt(20000, 80000), usersReached: randomInt(40000, 150000), conversionRate: 0.42 },
      { name: 'FoodDash', co2SavedKg: randomInt(15000, 60000), usersReached: randomInt(30000, 120000), conversionRate: 0.38 },
      { name: 'ShopFast', co2SavedKg: randomInt(10000, 40000), usersReached: randomInt(20000, 80000), conversionRate: 0.31 },
    ],
    sdgAlignment: [
      { goal: 'SDG 12', name: 'Responsible Consumption & Production', score: 0.89 },
      { goal: 'SDG 13', name: 'Climate Action', score: 0.94 },
      { goal: 'SDG 11', name: 'Sustainable Cities & Communities', score: 0.72 },
    ],
    monthlyTrend: Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 86400000).toLocaleString('default', { month: 'short' }),
      co2SavedKg: randomInt(5000 + i * 3000, 15000 + i * 5000),
    })),
    certificationReady: true,
    complianceStandards: ['GRI 305', 'ISO 14064', 'CDP Climate'],
  };

  return NextResponse.json(report, {
    headers: { 'Cache-Control': 'no-cache' },
  });
}
