"use client";

import { useMemo, useState } from "react";
import { PLACES } from "@/data/places";
import { recommend } from "@/lib/recommend";
import type { Answers, ScoredTrip } from "@/lib/types";
import IndonesiaMap from "@/components/IndonesiaMap";

interface Props {
  answers: Answers;
  onRestart: () => void;
}

export default function Results({ answers, onRestart }: Props) {
  const scored = useMemo(() => recommend(answers), [answers]);
  const top = scored.slice(0, 3);
  const [selectedId, setSelectedId] = useState(top[0]?.trip.id ?? "");
  const [hoverPlace, setHoverPlace] = useState<string | null>(null);
  const selected = top.find((s) => s.trip.id === selectedId) ?? top[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24">
      <header className="pt-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">Your trip DNA</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Here&apos;s what fits you
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
          Based on your answers, ranked for a Jan–Feb trip. Hover the map to explore each stop —
          then pick your favourite.
        </p>
      </header>

      {/* Map */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-deep/10 bg-deep shadow-xl">
        <IndonesiaMap
          trip={selected?.trip}
          activePlace={hoverPlace}
          onPlaceHover={setHoverPlace}
          className="w-full"
        />
      </div>

      {/* Trip tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {top.map((s, i) => (
          <button
            key={s.trip.id}
            onClick={() => setSelectedId(s.trip.id)}
            className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
              s.trip.id === selectedId
                ? "border-transparent text-white"
                : "border-deep/15 bg-white text-ink hover:border-deep/30"
            }`}
            style={s.trip.id === selectedId ? { backgroundColor: s.trip.accent } : undefined}
          >
            <span className="opacity-70">#{i + 1}</span>
            {s.trip.name}
            <span className={s.trip.id === selectedId ? "opacity-90" : "text-teal"}>
              {Math.round(s.score * 100)}%
            </span>
          </button>
        ))}
      </div>

      {/* Selected trip detail */}
      {selected && <TripDetail key={selected.trip.id} scored={selected} onHover={setHoverPlace} />}

      {/* Runner-up mini cards */}
      {scored.length > 3 && (
        <div className="mt-14">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
            Also worth a look
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {scored.slice(3).map((s) => (
              <div key={s.trip.id} className="rounded-2xl border border-deep/10 bg-white/60 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-ink">{s.trip.name}</span>
                  <span className="text-sm text-ink-soft">{Math.round(s.score * 100)}% match</span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{s.trip.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-deep/10 pt-10 text-center">
        <p className="max-w-lg text-ink-soft">
          These are starting points, not fixed plans — every one bends around your dates and
          budget. Local know-how fills in the rest.
        </p>
        <button
          onClick={onRestart}
          className="rounded-full border-2 border-ink px-6 py-3 font-semibold text-ink transition hover:bg-ink hover:text-sand"
        >
          ↺ Retake the quiz
        </button>
      </div>
    </div>
  );
}

function TripDetail({
  scored,
  onHover,
}: {
  scored: ScoredTrip;
  onHover: (id: string | null) => void;
}) {
  const { trip, reasons, warnings } = scored;
  return (
    <div className="mt-8 animate-fade-up rounded-3xl border border-deep/10 bg-white p-6 shadow-sm sm:p-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: trip.accent }}>
            {trip.tagline}
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{trip.name}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-ink-soft">{trip.idealDays} days ideal</div>
          <div className="font-semibold text-ink">{trip.costHint}</div>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-ink-soft">{trip.summary}</p>

      {/* Reasons / warnings */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {reasons.map((r) => (
          <div key={r} className="flex items-start gap-2 rounded-xl bg-teal/8 px-4 py-3 text-sm text-ink">
            <span className="text-teal">✓</span>
            {r}
          </div>
        ))}
        {warnings.map((w) => (
          <div key={w} className="flex items-start gap-2 rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
            <span>⚠️</span>
            {w}
          </div>
        ))}
      </div>

      {trip.caveat && (
        <p className="mt-4 rounded-xl border border-coral/25 bg-coral/8 px-4 py-3 text-sm text-ink">
          <span className="font-semibold text-coral">Season note — </span>
          {trip.caveat}
        </p>
      )}

      {/* Route */}
      <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-ink-soft">
        The route
      </h3>
      <ol className="mt-4 space-y-3">
        {trip.route.map((id, i) => {
          const p = PLACES[id];
          return (
            <li
              key={id}
              onMouseEnter={() => onHover(id)}
              onMouseLeave={() => onHover(null)}
              className="flex gap-4 rounded-2xl p-3 transition hover:bg-sand"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: trip.accent }}
              >
                {i + 1}
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-ink">{p.name}</span>
                  <span className="text-xs uppercase tracking-wide text-ink-soft">{p.region}</span>
                </div>
                <p className="text-sm text-ink-soft">{p.blurb}</p>
                {p.seasonNote && (
                  <p className="mt-1 text-xs italic text-ink-soft/80">🌧️ {p.seasonNote}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
