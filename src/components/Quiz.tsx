"use client";

import { useState } from "react";
import { QUESTIONS, type QuizShape } from "@/data/quiz";
import { expandInterests } from "@/lib/recommend";
import type { Answers } from "@/lib/types";

interface Props {
  onComplete: (answers: Answers) => void;
}

const EMPTY: QuizShape = {
  days: "",
  interests: [],
  pace: "",
  budget: "",
  hikes: "",
  boats: "",
  rain: "",
  romance: "",
};

function normalise(shape: QuizShape): Answers {
  return {
    days: parseInt(shape.days || "9", 10),
    interests: expandInterests(shape.interests),
    pace: (shape.pace || "balanced") as Answers["pace"],
    budget: (shape.budget || "mid") as Answers["budget"],
    hikes: (shape.hikes || "some") as Answers["hikes"],
    boats: (shape.boats || "some") as Answers["boats"],
    rain: (shape.rain || "fine") as Answers["rain"],
    romance: shape.romance === "yes",
  };
}

export default function Quiz({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [shape, setShape] = useState<QuizShape>(EMPTY);
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;

  const current = shape[q.id];
  const selectedMulti = Array.isArray(current) ? current : [];
  const isAnswered = q.kind === "multi" ? selectedMulti.length > 0 : Boolean(current);

  function go(next: number) {
    if (next < 0) return;
    if (next >= total) {
      onComplete(normalise(shape));
      return;
    }
    setStep(next);
  }

  function pickSingle(value: string) {
    setShape((s) => ({ ...s, [q.id]: value }));
    // Auto-advance single-choice questions for a snappy feel.
    setTimeout(() => go(step + 1), 220);
  }

  function toggleMulti(value: string) {
    setShape((s) => {
      const arr = Array.isArray(s[q.id]) ? [...(s[q.id] as string[])] : [];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else if (arr.length < (q.max ?? 99)) arr.push(value);
      return { ...s, [q.id]: arr };
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm text-ink-soft">
          <span className="font-medium">
            Question {step + 1} <span className="opacity-50">/ {total}</span>
          </span>
          <button
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="rounded-full px-3 py-1 text-ink-soft transition hover:bg-sand-2 disabled:opacity-0"
          >
            ← Back
          </button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-2">
          <div
            className="h-full rounded-full bg-teal transition-all duration-500"
            style={{ width: `${((step + (isAnswered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      <div key={q.id} className="animate-fade-up">
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{q.title}</h2>
        {q.subtitle && <p className="mt-3 max-w-xl text-ink-soft">{q.subtitle}</p>}
        {q.kind === "multi" && (
          <p className="mt-2 text-sm font-medium text-teal">
            {selectedMulti.length} / {q.max} selected
          </p>
        )}

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {q.choices.map((c) => {
            const selected =
              q.kind === "multi" ? selectedMulti.includes(c.value) : current === c.value;
            const handler = q.kind === "multi" ? () => toggleMulti(c.value) : () => pickSingle(c.value);
            return (
              <button
                key={c.value}
                onClick={handler}
                className={`group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  selected
                    ? "border-teal bg-teal/5 shadow-sm"
                    : "border-transparent bg-white/70 hover:border-teal/30 hover:bg-white"
                }`}
              >
                <span className="text-2xl transition-transform group-hover:scale-110">{c.emoji}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{c.label}</span>
                  {c.hint && <span className="block text-sm text-ink-soft">{c.hint}</span>}
                </span>
                {selected && <span className="ml-auto text-teal">✓</span>}
              </button>
            );
          })}
        </div>

        {q.kind === "multi" && (
          <button
            onClick={() => go(step + 1)}
            disabled={!isAnswered}
            className="mt-8 w-full rounded-full bg-ink px-6 py-4 font-semibold text-sand transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
          >
            {step + 1 === total ? "See our trips →" : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}
