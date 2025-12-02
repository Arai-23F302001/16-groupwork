import React, { useState, useRef } from "react";

export default function TenSecondGame() {
  const [message, setMessage] = useState(""); // 判定メッセージ
  const [isPlaying, setIsPlaying] = useState(false); // ゲーム中か
  const [elapsedTime, setElapsedTime] = useState(null); // 経過時間
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

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
      const rounded = elapsed.toFixed(2);
      setElapsedTime(rounded); // 経過時間を保存

      // 判定
      if (Math.abs(elapsed - 10) < 0.01) {
        setMessage("クリア！");
      } else if (Math.abs(elapsed - 10) <= 0.5) {
        setMessage("ニアピン！");
      } else {
        setMessage("失敗…");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!isPlaying && (
        <button
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
          onClick={startGame}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          スタート
        </button>
      )}

      {isPlaying && (
        <button
          className="px-4 py-2 rounded-xl bg-red-600 text-white"
          onClick={stopGame}
          style={{ padding: "10px 20px", fontSize: "16px" }}
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

      {message && <h2 style={{ marginTop: "20px" }}>{message}</h2>}
    </div>
  );
}
