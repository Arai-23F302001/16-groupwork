import React, { useState } from "react";
import cookieImg from "../../assets/cookie.png";
import CookieRankDisplay from "./CookieRankDisplay";
import { getCookieRank } from "../../lib/CookieRank";
export default function CookieClicker() {
  const [count, setCount] = useState(0);
  const currentRank = getCookieRank(count);
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
      <CookieRankDisplay currentRank={currentRank} clickCount={count} />
    </div>
  );
}
