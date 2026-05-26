import { NextResponse } from 'next/server';

const names = ['Sarah', 'Arjun', 'Mei', 'Carlos', 'Priya', 'James', 'Fatima', 'Yuki', 'Rahul', 'Emma', 'Aisha', 'Liam', 'Ananya', 'Diego', 'Sophie', 'Ravi', 'Chloe', 'Omar', 'Kavya', 'Noah'];
const cities = ['Bangalore', 'Mumbai', 'Berlin', 'New York', 'Tokyo', 'London', 'Delhi', 'Chennai', 'Hyderabad', 'Singapore', 'Dubai', 'San Francisco', 'Paris', 'Sydney', 'Toronto'];
const platforms = ['QuickRide', 'FoodDash', 'ShopFast'];
const actions = [
  { tpl: 'chose a shared ride instead of solo cab', co2Range: [800, 2500] },
  { tpl: 'switched to a vegetarian meal', co2Range: [500, 1800] },
  { tpl: 'picked standard shipping over express', co2Range: [300, 900] },
  { tpl: 'chose metro over cab ride', co2Range: [1200, 3000] },
  { tpl: 'selected a sustainable brand', co2Range: [2000, 5000] },
  { tpl: 'opted for a local restaurant', co2Range: [200, 600] },
  { tpl: 'chose a bicycle for a short trip', co2Range: [400, 1500] },
  { tpl: 'switched to a vegan option', co2Range: [600, 2200] },
  { tpl: 'picked store pickup instead of delivery', co2Range: [300, 800] },
  { tpl: 'chose an e-scooter ride', co2Range: [500, 1800] },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEvent() {
  const action = randomItem(actions);
  const co2 = randomInt(action.co2Range[0], action.co2Range[1]);
  return {
    user: randomItem(names),
    city: randomItem(cities),
    platform: randomItem(platforms),
    co2Saved: co2,
    action: action.tpl,
    timestamp: new Date().toISOString(),
  };
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial event immediately
      const initial = generateEvent();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));

      const interval = setInterval(() => {
        try {
          const event = generateEvent();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      // Clean up after 5 minutes to prevent zombie connections
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 300000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
