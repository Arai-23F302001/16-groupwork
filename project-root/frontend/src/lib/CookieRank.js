export const COOKIE_RANKS = [
  { min: 0, label: "Beginner", color: "#aaa", points: 10 },
  { min: 100, label: "Bronze", color: "#cd7f32", points: 50 },
  { min: 300, label: "Silver", color: "#c0c0c0", points: 100 },
  { min: 600, label: "Gold", color: "#ffd700", points: 1000 },
  { min: 1000, label: "Legend", color: "#ff4500", points: 5000 },
];

export function getCookieRank(clickCount) {
  return [...COOKIE_RANKS].reverse().find(r => clickCount >= r.min);
}