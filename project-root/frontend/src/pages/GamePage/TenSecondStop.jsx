import React, { useState } from "react";

export default function TenSecondGame() {
  const [time, setTime] = useState(0); // 経過時間
  const [message, setMessage] = useState(""); // 結果メッセージ
  const timerRef = useRef(null); // タイマーID
  const startTimeRef = useRef(0); // 開始時刻

  const startGame = () => {
    setMessage("");
    setTime(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTime(elapsed.toFixed(2));
    }, 10);
  };

  const stopGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTime(elapsed.toFixed(2));

      // 判定
      if (Math.abs(elapsed - 10) <= 0.5) {
        setMessage("ニアピン！");
      } else if (Math.abs(elapsed - 10) < 0.01) {
        setMessage("クリア！");
      } else {
        setMessage("失敗…");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>10秒押しゲーム</h1>
      <p>経過時間: {time} 秒</p>
      <button onClick={startGame} style={{ marginRight: "10px" }}>
        スタート
      </button>
      <button onClick={stopGame}>ストップ</button>
      <h2>{message}</h2>
    </div>
  );
}
