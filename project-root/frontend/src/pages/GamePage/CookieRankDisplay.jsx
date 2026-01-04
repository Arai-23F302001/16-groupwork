import React, { useState, useRef, useEffect } from "react";
import { COOKIE_RANKS } from "../../lib/CookieRank";

// ポップアップコンポーネント
function RankUpPopup({ rank, points, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3秒後に自動で消える

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 transform pointer-events-auto border-4"
        style={{
          borderColor: rank.color,
          animation:
            "bounceIn 0.5s ease-out, fadeOut 0.5s ease-in 2.5s forwards",
        }}
      >
        <div className="text-center">
          <div
            className="text-4xl font-bold mb-4"
            style={{ color: rank.color }}
          >
            🎉 RANK UP! 🎉
          </div>
          <div
            className="text-3xl font-bold mb-3"
            style={{ color: rank.color }}
          >
            {rank.label}
          </div>
          <div className="text-2xl text-gray-700 font-semibold">
            +{points} ポイント獲得！
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(10deg); }
          70% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

// メインコンポーネント
export default function CookieRankDisplay({ currentRank, onRankUp }) {
  const prevRankRef = useRef(currentRank);
  const [showPopup, setShowPopup] = useState(false);
  const [rankUpInfo, setRankUpInfo] = useState(null);

  useEffect(() => {
    // ランクアップ検知
    if (prevRankRef.current?.label !== currentRank.label) {
      console.log("🎊 RANK UP!", currentRank.label);

      // ポップアップ情報をセット
      setRankUpInfo({
        rank: currentRank,
        points: currentRank.points,
      });
      setShowPopup(true);

      // 親コンポーネント（GamePage）に通知してFirebase保存
      if (onRankUp) {
        onRankUp(currentRank.points, currentRank.label);
      }
    }
    prevRankRef.current = currentRank;
  }, [currentRank, onRankUp]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="w-40 p-2 border rounded-xl bg-gray-50 shadow-sm">
        <div className="text-center text-sm font-bold mb-2 text-gray-700">
          Rank
        </div>

        <div className="flex flex-col-reverse gap-2">
          {COOKIE_RANKS.map((rank) => {
            const isActive = rank.label === currentRank.label;

            return (
              <div
                key={rank.label}
                className={`text-center py-2 rounded-lg transition-all duration-300
                  ${isActive ? "scale-110 text-white shadow-lg" : "opacity-40"}
                `}
                style={{
                  backgroundColor: rank.color,
                  filter: isActive ? "none" : "grayscale(80%)",
                }}
              >
                <div className="font-bold text-sm">{rank.label}</div>
                {isActive && (
                  <div className="text-xs mt-1 font-semibold">
                    +{rank.points}pt
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ランクアップポップアップ */}
      {showPopup && rankUpInfo && (
        <RankUpPopup
          rank={rankUpInfo.rank}
          points={rankUpInfo.points}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}
