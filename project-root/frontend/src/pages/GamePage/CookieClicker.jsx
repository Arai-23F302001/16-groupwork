import React, { useState } from "react";
import cookieImg from "../../assets/cookie.png";
import CookieRankDisplay from "./CookieRankDisplay";
import { getCookieRank } from "../../lib/CookieRank";
import { addPointToUser } from "../../lib/pointRepository";
import { auth } from "../../firebase";

export default function CookieClicker() {
  const [count, setCount] = useState(0);
  const currentRank = getCookieRank(count);

  // 🔽 ランクアップ時に呼ばれる
  const handleRankUp = async (points, rankLabel) => {
    if (!auth.currentUser) return;

    try {
      await addPointToUser(auth.currentUser.uid, points, "cookieClicker");
      console.log(`🍪 ${rankLabel} 到達：+${points}pt`);
    } catch (e) {
      console.error("ポイント保存失敗", e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <h3 className="text-lg font-bold">クッキーをクリックして増やそう！</h3>

      <img
        src={cookieImg}
        alt="cookie"
        className="w-32 h-32 cursor-pointer hover:scale-110 transition-transform drop-shadow-lg"
        onClick={() => setCount((c) => c + 1)}
      />

      <div className="text-xl font-semibold">クリック数：{count}</div>

      <CookieRankDisplay currentRank={currentRank} onRankUp={handleRankUp} />
    </div>
  );
}
