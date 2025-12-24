import React, { useState, useRef } from "react";
import { judgeTenSecondsPoint } from "../../lib/point";

export default function TenSecondGame() {
  const [message, setMessage] = useState(""); // 判定メッセージ
  const [isPlaying, setIsPlaying] = useState(false); // ゲーム中か
  const [elapsedTime, setElapsedTime] = useState(null); // 経過時間
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const [point, setPoint] = useState(0);
  const startGame = () => {
    setMessage("");
    setElapsedTime(null);
    setIsPlaying(true);
    startTimeRef.current = Date.now();

    // 経過時間表示は不要なので空のsetInterval
    timerRef.current = setInterval(() => {}, 10);
  };

  const stopGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsPlaying(false);

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const rounded = Number(elapsed.toFixed(2));
      setElapsedTime(rounded);

      // 🔽 ここが新しい判定
      const result = judgeTenSecondsPoint(rounded);
      setMessage(result.label);
      setPoint(result.point);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!isPlaying && (
        <button
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
          onClick={startGame}
        >
          スタート
        </button>
      )}

      {isPlaying && (
        <button
          className="px-4 py-2 rounded-xl bg-red-600 text-white"
          onClick={stopGame}
        >
          ストップ
        </button>
      )}

      {elapsedTime && (
        <div
          style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}
        >
          {elapsedTime} 秒
        </div>
      )}

      {/* 既存 */}
      {message && <h2 style={{ marginTop: "20px" }}>{message}</h2>}

      {/* 🔽 ここを追加 */}
      {point > 0 && (
        <p style={{ fontSize: "24px", marginTop: "10px" }}>+{point} pt</p>
      )}
    </div>
  );
}
