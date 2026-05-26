// ─── Action Categories ───────────────────────────────────────────────────────
export type ActionCategory = 'transport' | 'food' | 'shopping';

// ─── User Action ─────────────────────────────────────────────────────────────
/** Represents a user action (what the user wants to do) */
export interface UserAction {
  id: string;
  category: ActionCategory;
  title: string;
  description: string;
  // transport-specific
  distance?: number; // km
  mode?: string; // 'cab' | 'auto' | 'bike'
  // food-specific
  cuisine?: string;
  mealType?: string; // 'non-veg' | 'veg' | 'vegan'
  packagingType?: string;
  // shopping-specific
  productType?: string;
  shippingMode?: string; // 'express' | 'standard' | 'pickup'
  quantity?: number;
}

// ─── Carbon Footprint Result ─────────────────────────────────────────────────
export interface CarbonResult {
  co2Grams: number;
  waterLiters: number;
  energyKwh: number;
  sustainabilityScore: number; // 0-100
}

// ─── Green Alternative ───────────────────────────────────────────────────────
/** A greener alternative suggestion returned by the nudge engine */
export interface GreenAlternative {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  co2Saved: number; // grams saved vs. original
  waterSaved: number;
  energySaved: number;
  sustainabilityScore: number;
  convenienceTradeoff: string; // e.g. '+5 min wait'
  costDifference: string; // e.g. '-₹30' or '+₹10'
  ecoPoints: number;
}

// ─── Nudge Response ──────────────────────────────────────────────────────────
/** The full nudge response returned by the API */
export interface NudgeResponse {
  action: UserAction;
  currentImpact: CarbonResult;
  alternatives: GreenAlternative[];
  funFact: string;
  treesEquivalent: number;
}

// ─── Impact Tracker Stats ────────────────────────────────────────────────────
export interface ImpactStats {
  totalCo2Saved: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  totalEcoPoints: number;
  decisionsOverridden: number;
  treesEquivalent: number;
}

// ─── Demo Scenario ───────────────────────────────────────────────────────────
/** Demo scenario for the mock platform integrations */
export interface DemoScenario {
  id: string;
  category: ActionCategory;
  platformName: string;
  platformIcon: string;
  platformColor: string;
  userAction: UserAction;
  mockDetails: Record<string, string>;
}
