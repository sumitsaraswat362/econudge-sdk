import type {
  UserAction,
  CarbonResult,
  GreenAlternative,
  NudgeResponse,
} from './types';

// ─── Emission Factors ────────────────────────────────────────────────────────

/** Transport: grams CO₂ per km */
const TRANSPORT_EMISSIONS: Record<string, number> = {
  cab: 192,
  'solo-cab': 192,
  auto: 85,
  'auto-rickshaw': 85,
  bike: 70,
  motorcycle: 70,
  'shared-cab': 64,
  bus: 30,
  metro: 15,
  train: 15,
  bicycle: 0,
  walk: 0,
  'e-scooter': 10,
};

/** Food: grams CO₂ per meal */
const FOOD_EMISSIONS: Record<string, number> = {
  'non-veg': 3500,
  'non-veg-heavy': 3500,
  'non-veg-chicken': 1800,
  chicken: 1800,
  vegetarian: 800,
  veg: 800,
  vegan: 400,
  'local-seasonal': 300,
  local: 300,
};

/** Shopping: grams CO₂ per item */
const SHIPPING_EMISSIONS: Record<string, number> = {
  express: 1200,
  standard: 600,
  pickup: 100,
  'store-pickup': 100,
};

const PRODUCT_EMISSIONS: Record<string, number> = {
  'fast-fashion': 8000,
  fashion: 8000,
  sustainable: 3000,
  'sustainable-brand': 3000,
  'second-hand': 200,
  thrift: 200,
  electronics: 5000,
  general: 2000,
};

/** Water factor: liters per gram CO₂ (rough proxy) */
const WATER_FACTOR = 0.12;
/** Energy factor: kWh per gram CO₂ (rough proxy) */
const ENERGY_FACTOR = 0.0008;
/** A mature tree absorbs ~22 kg CO₂/year */
const CO2_PER_TREE_YEAR = 22000;

// ─── Fun Facts ───────────────────────────────────────────────────────────────

const FUN_FACTS: string[] = [
  'A single mature tree absorbs about 22 kg of CO₂ per year — roughly the weight of a carry-on suitcase.',
  'Choosing a vegetarian meal over beef saves roughly 2,700 g of CO₂ — equivalent to driving 14 km in a car.',
  'If every online shopper chose standard over express delivery, we could cut shipping emissions by 30%.',
  'Walking or cycling for short trips under 3 km eliminates transport emissions entirely and boosts your health.',
  'The fashion industry produces 10% of global carbon emissions — more than aviation and shipping combined.',
  'Eating locally-sourced food can cut your meal\'s carbon footprint by up to 50%.',
  'A shared cab ride cuts per-person emissions by up to 67% compared to a solo ride.',
  'Taking the metro instead of a cab for 10 km saves about 1,770 g of CO₂ — enough to inflate 890 balloons.',
  'Second-hand clothing produces 97% fewer carbon emissions than fast fashion items.',
  'Switching from express to standard shipping saves about 600 g of CO₂ per package.',
  'India\'s metro systems prevent over 1.8 million tonnes of CO₂ annually.',
  'An e-scooter trip produces 95% less CO₂ than the same trip in a solo cab.',
  'Plant-based meals use 75% less land and produce 90% fewer emissions than meat-heavy meals.',
  'Consolidating multiple online orders into one shipment can halve your delivery carbon footprint.',
  'Cycling 5 km instead of driving saves about 960 g of CO₂ — the same as charging your phone 120 times.',
];

// ─── Worst-case baselines (for sustainability scoring) ───────────────────────

const WORST_TRANSPORT_PER_KM = 192; // solo cab
const WORST_FOOD_PER_MEAL = 3500; // heavy non-veg
const WORST_SHOPPING_PER_ITEM = 8000 + 1200; // fast fashion + express

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuid(): string {
  return `alt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Core Engine Functions ───────────────────────────────────────────────────

/**
 * Calculate the environmental impact of a user action.
 */
export function calculateImpact(action: UserAction): CarbonResult {
  let co2Grams = 0;
  let worstCase = 0;

  switch (action.category) {
    case 'transport': {
      const distance = action.distance ?? 5;
      const mode = (action.mode ?? 'cab').toLowerCase();
      const emissionRate = TRANSPORT_EMISSIONS[mode] ?? TRANSPORT_EMISSIONS['cab'];
      co2Grams = emissionRate * distance;
      worstCase = WORST_TRANSPORT_PER_KM * distance;
      break;
    }
    case 'food': {
      const mealType = (action.mealType ?? 'non-veg').toLowerCase();
      co2Grams = FOOD_EMISSIONS[mealType] ?? FOOD_EMISSIONS['non-veg'];
      // Packaging adds a small overhead
      if (action.packagingType === 'plastic') co2Grams += 150;
      if (action.packagingType === 'styrofoam') co2Grams += 200;
      worstCase = WORST_FOOD_PER_MEAL;
      break;
    }
    case 'shopping': {
      const quantity = action.quantity ?? 1;
      const productType = (action.productType ?? 'general').toLowerCase();
      const shippingMode = (action.shippingMode ?? 'standard').toLowerCase();
      const productCO2 = PRODUCT_EMISSIONS[productType] ?? PRODUCT_EMISSIONS['general'];
      const shippingCO2 = SHIPPING_EMISSIONS[shippingMode] ?? SHIPPING_EMISSIONS['standard'];
      co2Grams = (productCO2 + shippingCO2) * quantity;
      worstCase = WORST_SHOPPING_PER_ITEM * quantity;
      break;
    }
  }

  co2Grams = round2(co2Grams);
  const waterLiters = round2(co2Grams * WATER_FACTOR);
  const energyKwh = round2(co2Grams * ENERGY_FACTOR);

  // Higher score = greener. 100 = zero emissions, 0 = worst case.
  const sustainabilityScore = worstCase > 0
    ? clamp(Math.round((1 - co2Grams / worstCase) * 100), 0, 100)
    : 100;

  return { co2Grams, waterLiters, energyKwh, sustainabilityScore };
}

/**
 * Generate 2-3 greener alternatives for a given user action.
 */
export function generateAlternatives(action: UserAction): GreenAlternative[] {
  const currentImpact = calculateImpact(action);
  const alternatives: GreenAlternative[] = [];

  switch (action.category) {
    case 'transport': {
      const distance = action.distance ?? 5;
      const mode = (action.mode ?? 'cab').toLowerCase();

      // Build candidate alternatives (only modes greener than current)
      const candidates: Array<{
        mode: string;
        title: string;
        icon: string;
        description: string;
        convenienceTradeoff: string;
        costDifference: string;
      }> = [];

      const currentRate = TRANSPORT_EMISSIONS[mode] ?? 192;

      if (currentRate > TRANSPORT_EMISSIONS['shared-cab']) {
        candidates.push({
          mode: 'shared-cab',
          title: 'Share Your Ride',
          icon: '🚗',
          description: 'Split a cab with co-passengers heading the same way. Same comfort, less guilt.',
          convenienceTradeoff: '+5 min pickup',
          costDifference: '-₹' + Math.round(distance * 4),
        });
      }
      if (currentRate > TRANSPORT_EMISSIONS['bus'] && distance <= 25) {
        candidates.push({
          mode: 'bus',
          title: 'Take the Bus',
          icon: '🚌',
          description: 'AC city buses cover most routes and are surprisingly comfortable.',
          convenienceTradeoff: '+10 min travel',
          costDifference: '-₹' + Math.round(distance * 7),
        });
      }
      if (currentRate > TRANSPORT_EMISSIONS['metro'] && distance >= 3) {
        candidates.push({
          mode: 'metro',
          title: 'Metro / Train',
          icon: '🚇',
          description: 'Fast, air-conditioned, and ultra-low emissions. Beat the traffic too.',
          convenienceTradeoff: '+3 min walk to station',
          costDifference: '-₹' + Math.round(distance * 6),
        });
      }
      if (currentRate > TRANSPORT_EMISSIONS['e-scooter'] && distance <= 10) {
        candidates.push({
          mode: 'e-scooter',
          title: 'Rent an E-Scooter',
          icon: '🛴',
          description: 'Zip through traffic on an electric scooter. Fun and nearly zero emissions.',
          convenienceTradeoff: '+2 min unlock',
          costDifference: '-₹' + Math.round(distance * 3),
        });
      }
      if (currentRate > TRANSPORT_EMISSIONS['bicycle'] && distance <= 5) {
        candidates.push({
          mode: 'bicycle',
          title: 'Cycle There',
          icon: '🚲',
          description: 'Zero emissions, free exercise, and faster than you think for short trips.',
          convenienceTradeoff: `+${Math.round(distance * 2)} min`,
          costDifference: '-₹' + Math.round(distance * 8),
        });
      }

      // Pick up to 3
      const selected = candidates.slice(0, 3);

      for (const c of selected) {
        const altCO2 = TRANSPORT_EMISSIONS[c.mode] * distance;
        const co2Saved = round2(currentImpact.co2Grams - altCO2);
        const waterSaved = round2(co2Saved * WATER_FACTOR);
        const energySaved = round2(co2Saved * ENERGY_FACTOR);
        const worstCase = WORST_TRANSPORT_PER_KM * distance;
        const sustainabilityScore = worstCase > 0
          ? clamp(Math.round((1 - altCO2 / worstCase) * 100), 0, 100)
          : 100;

        alternatives.push({
          id: uuid(),
          title: c.title,
          description: c.description,
          icon: c.icon,
          co2Saved,
          waterSaved,
          energySaved,
          sustainabilityScore,
          convenienceTradeoff: c.convenienceTradeoff,
          costDifference: c.costDifference,
          ecoPoints: Math.round(co2Saved / 10),
        });
      }
      break;
    }

    case 'food': {
      const mealType = (action.mealType ?? 'non-veg').toLowerCase();
      const currentCO2 = FOOD_EMISSIONS[mealType] ?? FOOD_EMISSIONS['non-veg'];

      const candidates: Array<{
        type: string;
        title: string;
        icon: string;
        description: string;
        convenienceTradeoff: string;
        costDifference: string;
      }> = [];

      if (currentCO2 > FOOD_EMISSIONS['non-veg-chicken'] && mealType !== 'chicken') {
        candidates.push({
          type: 'non-veg-chicken',
          title: 'Switch to Chicken',
          icon: '🍗',
          description: 'Chicken has roughly half the carbon footprint of red meat. Still delicious!',
          convenienceTradeoff: 'Same prep time',
          costDifference: '-₹40',
        });
      }
      if (currentCO2 > FOOD_EMISSIONS['veg']) {
        candidates.push({
          type: 'veg',
          title: 'Go Vegetarian',
          icon: '🥗',
          description: 'A veggie meal cuts emissions by 70%+ compared to meat. Indian cuisine has incredible veg options.',
          convenienceTradeoff: 'No tradeoff',
          costDifference: '-₹60',
        });
      }
      if (currentCO2 > FOOD_EMISSIONS['vegan']) {
        candidates.push({
          type: 'vegan',
          title: 'Try a Vegan Meal',
          icon: '🌱',
          description: 'Plant-based meals have the lowest footprint. Try a buddha bowl or dal rice!',
          convenienceTradeoff: 'Fewer restaurant options',
          costDifference: '-₹30',
        });
      }
      if (currentCO2 > FOOD_EMISSIONS['local']) {
        candidates.push({
          type: 'local',
          title: 'Eat Local & Seasonal',
          icon: '🌾',
          description: 'Locally-sourced, seasonal ingredients slash transport and storage emissions.',
          convenienceTradeoff: 'Limited menu variety',
          costDifference: '-₹20',
        });
      }

      const selected = candidates.slice(0, 3);

      for (const c of selected) {
        const altCO2 = FOOD_EMISSIONS[c.type];
        const co2Saved = round2(currentImpact.co2Grams - altCO2);
        const waterSaved = round2(co2Saved * WATER_FACTOR);
        const energySaved = round2(co2Saved * ENERGY_FACTOR);
        const sustainabilityScore = clamp(
          Math.round((1 - altCO2 / WORST_FOOD_PER_MEAL) * 100),
          0,
          100
        );

        alternatives.push({
          id: uuid(),
          title: c.title,
          description: c.description,
          icon: c.icon,
          co2Saved,
          waterSaved,
          energySaved,
          sustainabilityScore,
          convenienceTradeoff: c.convenienceTradeoff,
          costDifference: c.costDifference,
          ecoPoints: Math.round(co2Saved / 10),
        });
      }
      break;
    }

    case 'shopping': {
      const quantity = action.quantity ?? 1;
      const productType = (action.productType ?? 'general').toLowerCase();
      const shippingMode = (action.shippingMode ?? 'standard').toLowerCase();
      const currentProductCO2 = PRODUCT_EMISSIONS[productType] ?? PRODUCT_EMISSIONS['general'];
      const currentShippingCO2 = SHIPPING_EMISSIONS[shippingMode] ?? SHIPPING_EMISSIONS['standard'];

      const candidates: Array<{
        productType: string;
        shippingMode: string;
        title: string;
        icon: string;
        description: string;
        convenienceTradeoff: string;
        costDifference: string;
      }> = [];

      // Suggest better shipping first
      if (currentShippingCO2 > SHIPPING_EMISSIONS['standard']) {
        candidates.push({
          productType,
          shippingMode: 'standard',
          title: 'Choose Standard Delivery',
          icon: '📦',
          description: 'Standard shipping consolidates packages, cutting emissions in half vs. express.',
          convenienceTradeoff: '+2-3 days delivery',
          costDifference: '-₹50',
        });
      }
      if (currentShippingCO2 > SHIPPING_EMISSIONS['pickup']) {
        candidates.push({
          productType,
          shippingMode: 'pickup',
          title: 'Pick Up In Store',
          icon: '🏪',
          description: 'Collect from a nearby store or locker. Minimal shipping emissions.',
          convenienceTradeoff: 'Visit store/locker',
          costDifference: '-₹80',
        });
      }

      // Suggest better product
      if (currentProductCO2 > PRODUCT_EMISSIONS['sustainable']) {
        candidates.push({
          productType: 'sustainable',
          shippingMode,
          title: 'Choose a Sustainable Brand',
          icon: '♻️',
          description: 'Sustainable brands use eco-friendly materials and ethical manufacturing.',
          convenienceTradeoff: 'Slightly fewer choices',
          costDifference: '+₹100',
        });
      }
      if (currentProductCO2 > PRODUCT_EMISSIONS['second-hand']) {
        candidates.push({
          productType: 'second-hand',
          shippingMode,
          title: 'Buy Second-Hand',
          icon: '🔄',
          description: 'Pre-loved items have a 97% lower carbon footprint. Great finds on resale platforms!',
          convenienceTradeoff: 'Check condition carefully',
          costDifference: '-₹' + Math.round(currentProductCO2 * 0.04),
        });
      }

      const selected = candidates.slice(0, 3);

      for (const c of selected) {
        const altProductCO2 = PRODUCT_EMISSIONS[c.productType] ?? currentProductCO2;
        const altShippingCO2 = SHIPPING_EMISSIONS[c.shippingMode] ?? currentShippingCO2;
        const altTotal = (altProductCO2 + altShippingCO2) * quantity;
        const co2Saved = round2(currentImpact.co2Grams - altTotal);
        const waterSaved = round2(co2Saved * WATER_FACTOR);
        const energySaved = round2(co2Saved * ENERGY_FACTOR);
        const sustainabilityScore = clamp(
          Math.round((1 - altTotal / (WORST_SHOPPING_PER_ITEM * quantity)) * 100),
          0,
          100
        );

        alternatives.push({
          id: uuid(),
          title: c.title,
          description: c.description,
          icon: c.icon,
          co2Saved: Math.max(0, co2Saved),
          waterSaved: Math.max(0, waterSaved),
          energySaved: Math.max(0, energySaved),
          sustainabilityScore,
          convenienceTradeoff: c.convenienceTradeoff,
          costDifference: c.costDifference,
          ecoPoints: Math.max(0, Math.round(co2Saved / 10)),
        });
      }
      break;
    }
  }

  // Sort by most CO₂ saved (best alternative first)
  alternatives.sort((a, b) => b.co2Saved - a.co2Saved);

  return alternatives;
}

/**
 * Generate the complete nudge response for a user action.
 */
export function generateNudge(action: UserAction): NudgeResponse {
  const currentImpact = calculateImpact(action);
  const alternatives = generateAlternatives(action);
  const funFact = pickRandom(FUN_FACTS);
  const treesEquivalent = round2(currentImpact.co2Grams / CO2_PER_TREE_YEAR);

  return {
    action,
    currentImpact,
    alternatives,
    funFact,
    treesEquivalent,
  };
}
