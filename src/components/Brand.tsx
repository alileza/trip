interface Props {
  /** "light" for use over the dark hero, "dark" for use on the sand background. */
  tone?: "light" | "dark";
  className?: string;
}

// Simple wordmark: a compass-rose glyph + "Explore with Ali".
export default function Brand({ tone = "dark", className = "" }: Props) {
  const text = tone === "light" ? "text-white" : "text-ink";
  const sub = tone === "light" ? "text-white/60" : "text-ink-soft";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid h-8 w-8 place-items-center rounded-full text-base"
        style={{ background: "linear-gradient(135deg, var(--teal), var(--gold))" }}
        aria-hidden
      >
        🧭
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-lg font-semibold ${text}`}>Indonesia Trip</span>
        <span className={`block text-[11px] uppercase tracking-widest ${sub}`}>with Ali · trip.alileza.me</span>
      </span>
    </span>
  );
}
