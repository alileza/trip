import type { Interest } from "@/lib/types";

export interface Choice {
  value: string;
  label: string;
  hint?: string;
  emoji: string;
  interests?: Interest[];
}

export interface Question {
  id: keyof QuizShape;
  kind: "single" | "multi";
  title: string;
  subtitle?: string;
  /** For multi questions, the max number of choices. */
  max?: number;
  choices: Choice[];
}

// Mirrors the fields of Answers, but as raw quiz values before normalising.
export interface QuizShape {
  days: string;
  interests: string[];
  pace: string;
  budget: string;
  hikes: string;
  boats: string;
  rain: string;
  romance: string;
}

export const QUESTIONS: Question[] = [
  {
    id: "days",
    kind: "single",
    title: "How long on the ground in Indonesia?",
    subtitle: "Roughly — you might fly home before Ali does.",
    choices: [
      { value: "6", label: "A quick week", hint: "≈ 5–7 days", emoji: "⏳" },
      { value: "9", label: "8–10 days", hint: "one region, done well", emoji: "🗓️" },
      { value: "14", label: "~2 weeks", hint: "room for two regions", emoji: "📅" },
      { value: "20", label: "3 weeks or more", hint: "the whole loop", emoji: "🌏" },
    ],
  },
  {
    id: "interests",
    kind: "multi",
    max: 3,
    title: "What does your ideal day look like?",
    subtitle: "Pick up to three — this drives everything.",
    choices: [
      { value: "beach", label: "Beaches & doing nothing", emoji: "🏖️", interests: ["beach", "easy"] },
      { value: "culture", label: "Temples, culture & local life", emoji: "🛕", interests: ["culture"] },
      { value: "history", label: "History, palaces & old towns", emoji: "🏛️", interests: ["history", "culture"] },
      { value: "music", label: "Live music, gigs & guitars", emoji: "🎸", interests: ["music", "nightlife"] },
      { value: "dance", label: "Dance & movement", emoji: "💃", interests: ["dance", "wellness"] },
      { value: "volcano", label: "Volcanoes & big hikes", emoji: "🌋", interests: ["volcano", "hiking"] },
      { value: "marine", label: "Snorkelling & diving", emoji: "🐠", interests: ["snorkel", "diving"] },
      { value: "food", label: "Food, markets & coffee", emoji: "🍜", interests: ["food"] },
      { value: "wildlife", label: "Wildlife & the wild east", emoji: "🦎", interests: ["wildlife"] },
      { value: "wellness", label: "Yoga, spa & slow mornings", emoji: "🧘", interests: ["wellness", "easy"] },
      { value: "nightlife", label: "Beach clubs & nights out", emoji: "🍹", interests: ["nightlife"] },
    ],
  },
  {
    id: "pace",
    kind: "single",
    title: "What pace suits you?",
    choices: [
      { value: "slow", label: "Slow", hint: "1–2 bases, really sink in", emoji: "🐢" },
      { value: "balanced", label: "Balanced", hint: "a couple of moves", emoji: "⚖️" },
      { value: "packed", label: "Packed", hint: "see as much as possible", emoji: "🚀" },
    ],
  },
  {
    id: "budget",
    kind: "single",
    title: "What's the comfort level?",
    choices: [
      { value: "backpacker", label: "Lean & local", hint: "guesthouses, warungs", emoji: "🎒" },
      { value: "mid", label: "Comfortable", hint: "nice hotels, some splurges", emoji: "🛎️" },
      { value: "boutique", label: "Boutique & special", hint: "design stays, private guides", emoji: "🥂" },
    ],
  },
  {
    id: "hikes",
    kind: "single",
    title: "Pre-dawn volcano hikes?",
    subtitle: "The good ones mean 2–4am starts and steep, sometimes slippery trails.",
    choices: [
      { value: "love", label: "Bring it on", emoji: "🥾" },
      { value: "some", label: "One or two, sure", emoji: "🌄" },
      { value: "no", label: "Hard pass", emoji: "😴" },
    ],
  },
  {
    id: "boats",
    kind: "single",
    title: "Boats & island-hopping?",
    subtitle: "Seas around Komodo and the Gilis can get choppy in Jan–Feb.",
    choices: [
      { value: "love", label: "Love being on the water", emoji: "⛵" },
      { value: "some", label: "A little is fine", emoji: "🚤" },
      { value: "no", label: "I get seasick — keep me on land", emoji: "🤢" },
    ],
  },
  {
    id: "rain",
    kind: "single",
    title: "It's rainy season. How do you feel?",
    subtitle: "Jan–Feb means warm afternoon downpours, lush greenery and fewer crowds.",
    choices: [
      { value: "chase", label: "I'll chase the sun", hint: "prioritise the driest spots", emoji: "☀️" },
      { value: "fine", label: "Afternoon rain is fine", hint: "flexible", emoji: "🌦️" },
      { value: "driest", label: "Give me the safest bets", hint: "minimise weather risk", emoji: "🌂" },
    ],
  },
  {
    id: "romance",
    kind: "single",
    title: "Is this a romantic trip for the two of you?",
    subtitle: "Nudges things toward couple-friendly stays and sunsets.",
    choices: [
      { value: "yes", label: "Yes, lean romantic", emoji: "💕" },
      { value: "no", label: "Just a great adventure", emoji: "🤙" },
    ],
  },
];
