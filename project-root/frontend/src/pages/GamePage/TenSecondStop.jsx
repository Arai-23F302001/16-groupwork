import React, { useState, useRef } from "react";
import { judgeTenSecondStopPoint } from "../../lib/point";
import { addPointToUser } from "../../lib/pointRepository";
import { auth } from "../../firebase";

export default function TenSecondGame({ onFinish }) {
  const [message, setMessage] = useState(""); // 判定メッセージ
  const [isPlaying, setIsPlaying] = useState(false); // ゲーム中か
  const [elapsedTime, setElapsedTime] = useState(null); // 経過時間
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const [points, setPoint] = useState(0);
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

      const result = judgeTenSecondStopPoint(rounded);
      setMessage(result.labl);
      setPoint(result.points);
      if (result.point > 0) {
        onFinish(result.point, "tenSecondStop");
      }
      if (result.points > 0 && auth.currentUser) {
        addPointToUser(
          auth.currentUser.uid,
          result.points,
          "tenSecondStop"
        ).catch(console.error);
      }
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
      {points > 0 && (
        <p style={{ fontSize: "24px", marginTop: "10px" }}>+{points} pt</p>
      )}
    </div>
  );
}
