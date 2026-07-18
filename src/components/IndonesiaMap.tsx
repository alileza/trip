"use client";

import { PLACES, placeList } from "@/data/places";
import { ISLANDS, MAP_H, MAP_W, polygon, project } from "@/lib/geo";
import type { Trip } from "@/lib/types";

interface Props {
  /** The trip whose route to highlight, if any. */
  trip?: Trip | null;
  /** Currently focused place id (hover/selection). */
  activePlace?: string | null;
  onPlaceHover?: (id: string | null) => void;
  className?: string;
}

// Build a smooth-ish route path through a trip's stops using quadratic arcs so
// the line reads like a journey rather than straight hops.
function routePath(routeIds: string[]): string {
  const pts = routeIds.map((id) => {
    const p = PLACES[id];
    return project(p.lon, p.lat);
  });
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2 - Math.min(60, Math.abs(x1 - x0) * 0.28); // arc upward
    d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

export default function IndonesiaMap({ trip, activePlace, onPlaceHover, className }: Props) {
  const routeSet = new Set(trip?.route ?? []);
  const accent = trip?.accent ?? "#12a3a0";
  const path = trip ? routePath(trip.route) : "";

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className={className}
      role="img"
      aria-label={trip ? `Route map for ${trip.name}` : "Map of Java, Bali and Nusa Tenggara"}
    >
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a3a49" />
          <stop offset="100%" stopColor="#0c2b38" />
        </linearGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f5d4a" />
          <stop offset="100%" stopColor="#17493a" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#sea)" />

      {/* subtle grid to suggest a nautical chart */}
      <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={(i * MAP_W) / 11} y1={0} x2={(i * MAP_W) / 11} y2={MAP_H} />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i * MAP_H) / 4} x2={MAP_W} y2={(i * MAP_H) / 4} />
        ))}
      </g>

      {/* islands */}
      <g>
        {ISLANDS.map((poly, i) => (
          <path
            key={i}
            d={polygon(poly)}
            fill="url(#land)"
            stroke="#2c7a5f"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
        ))}
      </g>

      {/* route */}
      {path && (
        <g>
          <path d={path} fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="8" filter="url(#soft)" />
          <path
            d={path}
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 10"
            className="route-dash"
          />
        </g>
      )}

      {/* pins */}
      <g>
        {placeList.map((p) => {
          if (p.id === "jakarta" && !routeSet.has("jakarta")) return null;
          const [x, y] = project(p.lon, p.lat);
          const onRoute = routeSet.has(p.id);
          const active = activePlace === p.id;
          const show = !trip || onRoute;
          const order = trip ? trip.route.indexOf(p.id) : -1;
          return (
            <g
              key={p.id}
              transform={`translate(${x} ${y})`}
              opacity={show ? 1 : 0.28}
              onMouseEnter={() => onPlaceHover?.(p.id)}
              onMouseLeave={() => onPlaceHover?.(null)}
              style={{ cursor: "default", transition: "opacity 0.4s" }}
            >
              {active && <circle r="14" fill={accent} opacity="0.25" />}
              <circle
                r={onRoute ? 6.5 : 4}
                fill={onRoute ? accent : "#e9e2d4"}
                stroke="#0c2b38"
                strokeWidth="2"
              />
              {onRoute && order >= 0 && (
                <text
                  x="0"
                  y="3.4"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill="#0c2b38"
                >
                  {order + 1}
                </text>
              )}
              <text
                x="0"
                y={-12}
                textAnchor="middle"
                fontSize="13"
                fontWeight={onRoute ? 700 : 500}
                fill={active ? accent : "#f3ede1"}
                style={{ paintOrder: "stroke", transition: "fill 0.2s" }}
                stroke="#0c2b38"
                strokeWidth="3"
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
