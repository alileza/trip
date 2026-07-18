// Shared domain types for the Indonesia trip planner.

export type Interest =
  | "beach"
  | "culture"
  | "history"
  | "music"
  | "dance"
  | "volcano"
  | "hiking"
  | "snorkel"
  | "diving"
  | "food"
  | "nightlife"
  | "wellness"
  | "wildlife"
  | "romance"
  | "easy"
  | "boat";

export type Pace = "slow" | "balanced" | "packed";
export type Budget = "backpacker" | "mid" | "boutique";
export type RainResilience = "low" | "medium" | "high";

export interface Place {
  id: string;
  name: string;
  region: string;
  /** Longitude / latitude in decimal degrees (used to project onto the map). */
  lon: number;
  lat: number;
  blurb: string;
  /** What this place is best known for, a couple of interest tags. */
  highlights: Interest[];
  /** Honest note about visiting in the Jan–Feb wet season. */
  seasonNote?: string;
}

export interface Trip {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  /** Ordered place ids forming the route drawn on the map. */
  route: string[];
  minDays: number;
  idealDays: number;
  pace: Pace;
  /** Budget levels this trip works well at. */
  budgets: Budget[];
  /** Interest -> strength (0–3) of how much this trip delivers it. */
  tags: Partial<Record<Interest, number>>;
  /** How well the itinerary holds up in the Jan–Feb rains. */
  rainResilience: RainResilience;
  /** Rough per-person budget guidance, excluding international flights. */
  costHint: string;
  /** The honest headline caveat, shown on the result card. */
  caveat?: string;
  accent: string;
}

export interface Answers {
  days: number; // number of days on the ground
  interests: Interest[]; // what their ideal day leans toward
  pace: Pace;
  budget: Budget;
  hikes: "love" | "some" | "no";
  boats: "love" | "some" | "no";
  rain: "chase" | "fine" | "driest";
  romance: boolean;
}

export interface ScoredTrip {
  trip: Trip;
  score: number; // 0..1
  reasons: string[];
  warnings: string[];
}
