import { TRIPS } from "@/data/trips";
import type { Answers, Interest, ScoredTrip, Trip } from "@/lib/types";

// Turn the "ideal day" multi-select values into weighted interest tags.
const INTEREST_MAP: Record<string, Interest[]> = {
  beach: ["beach", "easy"],
  culture: ["culture"],
  history: ["history", "culture"],
  music: ["music", "nightlife"],
  dance: ["dance", "wellness"],
  volcano: ["volcano", "hiking"],
  marine: ["snorkel", "diving"],
  food: ["food"],
  wildlife: ["wildlife"],
  wellness: ["wellness", "easy"],
  nightlife: ["nightlife"],
};

export function expandInterests(values: string[]): Interest[] {
  const set = new Set<Interest>();
  for (const v of values) for (const i of INTEREST_MAP[v] ?? []) set.add(i);
  return [...set];
}

function tripTagStrength(trip: Trip, interest: Interest): number {
  return trip.tags[interest] ?? 0;
}

const INTEREST_LABEL: Partial<Record<Interest, string>> = {
  beach: "beach time",
  culture: "temples & culture",
  history: "history & heritage",
  music: "live music",
  dance: "dance & movement",
  volcano: "volcanoes",
  hiking: "hiking",
  snorkel: "snorkelling",
  diving: "diving",
  food: "food",
  nightlife: "nightlife",
  wellness: "wellness",
  wildlife: "wildlife",
  romance: "romance",
};

/**
 * Score a single trip 0..1 against the guest's answers, with human-readable
 * reasons and warnings for the result card.
 */
export function scoreTrip(trip: Trip, answers: Answers): ScoredTrip {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // 1. Interest fit — the core signal (0..1).
  const wanted = answers.interests;
  let interestRaw = 0;
  let interestMax = 0;
  const matched: Interest[] = [];
  for (const i of wanted) {
    const strength = tripTagStrength(trip, i);
    interestRaw += strength;
    interestMax += 3;
    if (strength >= 2 && INTEREST_LABEL[i]) matched.push(i);
  }
  const interestFit = interestMax > 0 ? interestRaw / interestMax : 0.5;
  if (matched.length) {
    const names = matched.map((m) => INTEREST_LABEL[m]).slice(0, 3);
    reasons.push(`Strong on ${listWords(names as string[])}`);
  }

  // 2. Duration fit — does the trip physically fit the days available?
  let durationFit: number;
  if (answers.days < trip.minDays) {
    const short = trip.minDays - answers.days;
    durationFit = Math.max(0, 1 - short / 8); // heavy penalty, tapered
    warnings.push(
      `Really wants ${trip.minDays}+ days — tight in ${answers.days}. You'd trim stops.`,
    );
  } else if (answers.days >= trip.idealDays) {
    durationFit = 1;
    reasons.push(`Fits your ${answers.days} days comfortably`);
  } else {
    durationFit = 0.85;
  }

  // 3. Pace fit.
  const paceOrder = { slow: 0, balanced: 1, packed: 2 } as const;
  const paceGap = Math.abs(paceOrder[trip.pace] - paceOrder[answers.pace]);
  const paceFit = 1 - paceGap * 0.25;

  // 4. Budget fit.
  const budgetFit = trip.budgets.includes(answers.budget) ? 1 : 0.6;
  if (!trip.budgets.includes(answers.budget)) {
    warnings.push("Usually done at a higher comfort level than you picked.");
  }

  // 5. Volcano/hiking appetite vs how volcano-heavy the trip is.
  const volcanoLoad = tripTagStrength(trip, "volcano");
  let hikeFit = 1;
  if (answers.hikes === "no" && volcanoLoad >= 2) {
    hikeFit = 0.55;
    warnings.push("Built around pre-dawn volcano hikes you'd rather skip.");
  } else if (answers.hikes === "love" && volcanoLoad >= 2) {
    reasons.push("Delivers the big volcano sunrises");
  }

  // 6. Boat comfort vs how boat-heavy the trip is.
  const boatLoad = tripTagStrength(trip, "boat");
  let boatFit = 1;
  if (answers.boats === "no" && boatLoad >= 2) {
    boatFit = 0.5;
    warnings.push("Lots of time on boats — rough if you get seasick.");
  } else if (answers.boats === "love" && boatLoad >= 2) {
    reasons.push("Plenty of time out on the water");
  }

  // 7. Rain resilience vs the guest's weather appetite.
  const resScore = { low: 0, medium: 0.5, high: 1 }[trip.rainResilience];
  let rainFit = 1;
  if (answers.rain === "driest") {
    rainFit = 0.55 + resScore * 0.45;
    if (trip.rainResilience === "high") reasons.push("Holds up best in the Jan–Feb rains");
    if (trip.rainResilience === "low") warnings.push("Most weather-exposed option this time of year.");
  } else if (answers.rain === "chase") {
    rainFit = 0.7 + resScore * 0.3;
  }

  // 8. Romance nudge.
  let romanceBonus = 0;
  if (answers.romance && tripTagStrength(trip, "romance") >= 2) {
    romanceBonus = 0.05;
    reasons.push("Couple-friendly stays and sunsets");
  }

  // Weighted blend. Interest fit dominates, then whether it fits the days.
  const score =
    interestFit * 0.4 +
    durationFit * 0.22 +
    paceFit * 0.1 +
    budgetFit * 0.08 +
    hikeFit * 0.07 +
    boatFit * 0.07 +
    rainFit * 0.06 +
    romanceBonus;

  return {
    trip,
    score: Math.max(0, Math.min(1, score)),
    reasons: reasons.slice(0, 4),
    warnings: warnings.slice(0, 2),
  };
}

export function recommend(answers: Answers): ScoredTrip[] {
  return TRIPS.map((t) => scoreTrip(t, answers)).sort((a, b) => b.score - a.score);
}

function listWords(words: string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}
