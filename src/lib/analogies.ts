// Hyper-Personalized Impact Analogies
// Converts raw CO2 grams into relatable, shareable analogies

const phoneAnalogies = [
  (g: number) => `That's like charging your smartphone for ${Math.round(g / 8.22)} days straight! 📱`,
  (g: number) => `Equivalent to streaming ${Math.round(g / 36)} hours of Netflix! 🎬`,
  (g: number) => `Like sending ${Math.round(g / 0.014).toLocaleString()} emails! 📧`,
  (g: number) => `Equal to ${Math.round(g / 6)} Google searches! 🔍`,
];

const drivingAnalogies = [
  (g: number) => `Like driving ${(g / 192).toFixed(1)}km in a diesel SUV! 🚙`,
  (g: number) => `Equivalent to idling your car for ${Math.round(g / 150)} minutes in traffic! 🚗`,
  (g: number) => `Same as a ${(g / 192).toFixed(1)}km Uber ride during rush hour! 🚕`,
  (g: number) => `Like burning ${(g / 2310).toFixed(2)} liters of petrol! ⛽`,
];

const householdAnalogies = [
  (g: number) => `Like running your AC for ${(g / 900).toFixed(1)} hours on full blast! ❄️`,
  (g: number) => `Equivalent to ${Math.round(g / 500)} loads of laundry in hot water! 👕`,
  (g: number) => `Same as leaving 10 LED lights on for ${Math.round(g / 50)} hours! 💡`,
  (g: number) => `Like boiling your kettle ${Math.round(g / 70)} times! ☕`,
  (g: number) => `Equal to taking ${Math.round(g / 400)} hot 10-minute showers! 🚿`,
];

const flightAnalogies = [
  (g: number) => `Like flying ${Math.round(g / 255)}km in economy class! ✈️`,
  (g: number) => `Equivalent to ${(g / 90000 * 100).toFixed(1)}% of a Delhi-Mumbai flight! 🛫`,
  (g: number) => `Same carbon as a ${Math.round(g / 255)}km domestic flight! 🌍`,
];

const treeAnalogies = [
  (g: number) => `It would take ${Math.ceil(g / 22000)} trees an entire year to absorb this! 🌳`,
  (g: number) => `You'd need to plant ${Math.ceil(g / 22000)} trees to offset this! 🌲`,
  (g: number) => `A single tree would need ${Math.round(g / 60)} days to absorb this CO₂! 🍃`,
  (g: number) => `That's ${(g / 22000).toFixed(2)} tree-years of carbon absorption! 🌿`,
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getAnalogy(co2Grams: number): string {
  if (co2Grams < 100) return pickRandom(phoneAnalogies)(co2Grams);
  if (co2Grams < 500) return pickRandom(drivingAnalogies)(co2Grams);
  if (co2Grams < 2000) return pickRandom(householdAnalogies)(co2Grams);
  if (co2Grams < 5000) return pickRandom(flightAnalogies)(co2Grams);
  return pickRandom(treeAnalogies)(co2Grams);
}

export function getRandomFunAnalogy(co2Grams: number): string {
  const allAnalogies = [
    ...phoneAnalogies,
    ...drivingAnalogies,
    ...householdAnalogies,
    ...flightAnalogies,
    ...treeAnalogies,
  ];
  return pickRandom(allAnalogies)(co2Grams);
}
