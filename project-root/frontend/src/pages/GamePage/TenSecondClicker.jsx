import React, { useState, useEffect } from "react";

export default function TenSecondClicker({ user, board, setBoard }) {
  const [phase, setPhase] = useState("ready"); // ready | count | play | done
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase !== "count") return;
    setCountdown(3);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          setPhase("play");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    setTimeLeft(10);
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setPhase("done");
          const entry = { name: user?.name || "ゲスト", score, ts: Date.now() };
          const next = [...board, entry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
          setBoard(next);
          localStorage.setItem("game-board", JSON.stringify(next));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]); // eslint-disable-line

  function start() {
    setScore(0);
    setPhase("count");
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {phase === "ready" && (
        <button
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
          onClick={start}
        >
          スタート
        </button>
      )}
      {phase === "count" && (
        <div className="text-4xl font-bold">{countdown}</div>
      )}
      {phase === "play" && (
        <>
          <div className="text-sm text-gray-500">残り {timeLeft} 秒</div>
          <button
            className="px-6 py-6 rounded-2xl bg-emerald-600 text-white text-xl"
            onClick={() => setScore((s) => s + 1)}
          >
            クリック！+1
          </button>
          <div className="text-xl font-bold">スコア：{score}</div>
        </>
      )}
      {phase === "done" && (
        <>
          <div className="text-xl font-bold">結果：{score} pt</div>
          <button
            className="px-4 py-2 rounded-xl bg-gray-900 text-white"
            onClick={() => setPhase("ready")}
          >
            リスタート
          </button>
        </>
      )}
    </div>
  );
}
