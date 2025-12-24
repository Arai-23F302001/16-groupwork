export function judgeTenSecondsPoint(time) {
  const diff = Math.abs(time - 10);

  if (diff === 0) {
    return { label: "ぴったり章", point: 100 };
  }
  if (diff <= 0.1) {
    return { label: "くそ惜しいでしょう", point: 50 };
  }
  if (diff <= 0.5) {
    return { label: "ニアピン章", point: 5 };
  }
  if (diff <= 1.0) {
    return { label: "惜しかったでしょう", point: 3 };
  }
  if (diff <= 2.0) {
    return { label: "参加賞", point: 1 };
  }

  return { label: "残念", point: 0 };
}
export function calcTenSecondsPoint(time) {}
export function calcRenderGamePoint(score) {}