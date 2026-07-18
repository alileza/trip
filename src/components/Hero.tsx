"use client";

import IndonesiaMap from "@/components/IndonesiaMap";
import Brand from "@/components/Brand";
import { TRIPS } from "@/data/trips";

interface Props {
  onStart: () => void;
}

// Cycle the hero map through the trips isn't needed — one evocative default
// route reads as "a journey" without interaction.
const DEMO = TRIPS.find((t) => t.id === "culture-volcanoes") ?? TRIPS[0];

export default function Hero({ onStart }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* map backdrop */}
      <div className="absolute inset-0 opacity-95">
        <IndonesiaMap trip={DEMO} className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/40 via-deep/55 to-deep/85" />

      <div className="absolute left-0 right-0 top-0 z-10 flex justify-center px-5 pt-6 sm:justify-start sm:pl-8">
        <Brand tone="light" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center">
        <span className="mb-6 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
          🇮🇩 January – February · rainy season, low crowds
        </span>
        <h1 className="font-display text-5xl leading-[1.05] text-white sm:text-7xl">
          What should your
          <br />
          <span className="text-gold">Indonesia</span> trip be?
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
          Heading to Indonesia this January–February? Answer eight quick questions and we&apos;ll
          map the trip that actually fits you: temples, volcanoes, reefs, or just a hammock and a
          very good coffee.
        </p>
        <button
          onClick={onStart}
          className="mt-9 rounded-full bg-gold px-9 py-4 text-lg font-bold text-deep shadow-lg transition hover:scale-[1.03] hover:bg-[#ffc866] active:scale-100"
        >
          Plan our trip →
        </button>
        <p className="mt-5 text-sm text-white/60">Takes about 90 seconds · no sign-up</p>
      </div>

      <div className="relative border-t border-white/10 bg-deep/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-8 gap-y-2 px-5 py-4 text-sm text-white/70">
          <span>🛕 Java&apos;s temples</span>
          <span>🌋 Sunrise volcanoes</span>
          <span>🏝️ Bali &amp; the Gilis</span>
          <span>🦎 Komodo dragons</span>
          <span>🐠 Reefs &amp; mantas</span>
        </div>
      </div>
    </section>
  );
}
