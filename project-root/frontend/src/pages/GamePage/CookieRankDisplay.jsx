import React from "react";
import { useRef, useEffect } from "react";
import { COOKIE_RANKS } from "../../lib/CookieRank";

export default function CookieRankDisplay({ currentRank }) {
  const prevRankRef = useRef(currentRank);

  useEffect(() => {
    if (prevRankRef.current?.label !== currentRank.label) {
      // ランクアップ時の演出
      console.log("RANK UP!");
    }
    prevRankRef.current = currentRank;
  }, [currentRank]);

  return (
    <div className="w-40 p-2 border rounded-xl bg-gray-50">
      <div className="text-center text-sm font-bold mb-2">Rank</div>

      <div className="flex flex-col-reverse gap-2">
        {COOKIE_RANKS.map((rank) => {
          const isActive = rank.label === currentRank.label;

          return (
            <div
              key={rank.label}
              className={`text-center py-2 rounded-lg transition-all duration-300
                ${isActive ? "scale-110 text-white" : "opacity-40"}
              `}
              style={{
                backgroundColor: rank.color,
                filter: isActive ? "none" : "grayscale(80%)",
              }}
            >
              {rank.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
