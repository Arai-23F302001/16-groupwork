//UI用
export function judgeTenSecondStopPoint(time) {
  const diff = Math.abs(time - 10);

  if (diff === 0) {
    return { label: "ぴったり章", points: 100 };
  }
  if (diff <= 0.1) {
    return { label: "くそ惜しいでしょう", points: 50 };
  }
  if (diff <= 0.5) {
    return { label: "ニアピン章", points: 5 };
  }
  if (diff <= 1.0) {
    return { label: "惜しかったでしょう", points: 3 };
  }
  if (diff <= 2.0) {
    return { label: "参加賞", points: 1 };
  }

  return { label: "残念", points: 0 };
}
  // ポイント計算（Firebase・集計用）
export function calcTenSecondsPoint(time) {
  const diff = Math.abs(time - 10);

  if (diff === 0) return 100;
  if (diff <= 0.1) return 50;
  if (diff <= 0.5) return 5;
  if (diff <= 1.0) return 3;
  if (diff <= 2.0) return 1;

  return 0;
}

// クッキークリッカー：ランクアップ時のポイント計算
export function calcCookieClickerPoint(prevRank, nextRank) {
  if (!prevRank || !nextRank) return 0;

  // ランクが変わっていなければポイントなし
  if (prevRank.level === nextRank.level) {
    return 0;
  }

  // レベルが下がることは想定しない
  if (nextRank.level < prevRank.level) {
    return 0;
  }

  // ランク定義側に rewardPoint がある場合
  if (typeof nextRank.rewardPoint === "number") {
    return nextRank.rewardPoint;
  }
}

// 10秒連打（レンダー）ゲームのポイント計算
export function calcRenderGamePoint(clickCount) {
  return clickCount;
}

// 現在のポイントに加算（共通ルール）
export function addPoint(currentPoint, earnedPoint) {
  if (typeof currentPoint !== "number") return earnedPoint;
  if (typeof earnedPoint !== "number") return currentPoint;

  return currentPoint + earnedPoint;
}


