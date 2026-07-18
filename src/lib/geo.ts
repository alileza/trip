// Simple equirectangular projection for the Java → Nusa Tenggara strip, plus
// hand-simplified island outlines. Nothing here is survey-accurate — it just
// needs to read as a recognisable map and keep pins on the right islands.

export const MAP_W = 1200;
export const MAP_H = 300;

const LON_MIN = 104.6;
const LON_MAX = 121.2;
const LAT_TOP = -5.6; // northernmost (smallest y)
const LAT_BOTTOM = -9.2; // southernmost (largest y)

export function project(lon: number, lat: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * MAP_H;
  return [x, y];
}

/** Build an SVG path string from [lon,lat] points, closed. */
export function polygon(points: [number, number][]): string {
  return (
    points
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

// Rough outlines, west to east.
export const ISLANDS: [number, number][][] = [
  // Java
  [
    [105.2, -6.75],
    [106.0, -5.95],
    [107.0, -5.95],
    [108.4, -6.25],
    [110.4, -6.45],
    [111.6, -6.7],
    [112.7, -6.9],
    [113.6, -7.2],
    [114.4, -7.75],
    [114.2, -8.35],
    [113.2, -8.3],
    [111.5, -8.15],
    [110.0, -8.15],
    [108.3, -7.75],
    [106.6, -7.4],
    [105.4, -6.95],
  ],
  // Bali
  [
    [114.45, -8.15],
    [115.0, -8.05],
    [115.4, -8.2],
    [115.72, -8.45],
    [115.55, -8.82],
    [115.05, -8.85],
    [114.6, -8.55],
    [114.45, -8.35],
  ],
  // Lombok
  [
    [116.0, -8.3],
    [116.45, -8.25],
    [116.72, -8.5],
    [116.6, -8.85],
    [116.15, -8.9],
    [115.98, -8.6],
  ],
  // Sumbawa
  [
    [116.9, -8.4],
    [117.7, -8.25],
    [118.4, -8.3],
    [119.15, -8.6],
    [118.9, -8.95],
    [118.0, -8.9],
    [117.3, -8.9],
    [116.95, -8.65],
  ],
  // West Flores
  [
    [119.75, -8.3],
    [120.6, -8.35],
    [121.15, -8.55],
    [120.9, -8.85],
    [120.1, -8.85],
    [119.8, -8.6],
  ],
  // Komodo island
  [
    [119.35, -8.5],
    [119.55, -8.48],
    [119.62, -8.68],
    [119.4, -8.75],
    [119.3, -8.62],
  ],
];
