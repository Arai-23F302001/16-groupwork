export const COOKIE_RANKS = [
  { min: 0, label: "Beginner", color: "#aaa" },
  { min: 100, label: "Bronze", color: "#cd7f32" },
  { min: 300, label: "Silver", color: "#c0c0c0" },
  { min: 600, label: "Gold", color: "#ffd700" },
  { min: 1000, label: "Legend", color: "#ff4500" },
];

export function getCookieRank(clickCount) {
  return [...COOKIE_RANKS].reverse().find(r => clickCount >= r.min);
}
