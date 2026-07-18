"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Brand from "@/components/Brand";
import Quiz from "@/components/Quiz";
import Results from "@/components/Results";
import type { Answers } from "@/lib/types";

type Phase = "intro" | "quiz" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers | null>(null);

  return (
    <main className="min-h-screen">
      {phase === "intro" && <Hero onStart={() => setPhase("quiz")} />}

      {phase === "quiz" && (
        <div className="min-h-screen bg-sand py-16">
          <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between px-5">
            <button onClick={() => setPhase("intro")} aria-label="Back to start">
              <Brand tone="dark" />
            </button>
          </div>
          <Quiz
            onComplete={(a) => {
              setAnswers(a);
              setPhase("results");
            }}
          />
        </div>
      )}

      {phase === "results" && answers && (
        <div className="min-h-screen bg-sand">
          <Results answers={answers} onRestart={() => setPhase("quiz")} />
        </div>
      )}
    </main>
  );
}
