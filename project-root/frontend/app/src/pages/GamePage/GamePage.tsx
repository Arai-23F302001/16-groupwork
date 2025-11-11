import React, { useEffect, useState } from "react";
import { SectionCard } from "../../components/Ui";

type Score = { name: string; score: number; ts: number };

export default function GamePage({ user }: { user: { name: string; email: string } | null }) {
  const [phase, setPhase] = useState<"ready" | "count" | "play" | "done">("ready");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState<Score[]>(() => {
    const raw = localStorage.getItem("game-board");
    return raw ? JSON.parse(raw) : [];
  });

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
          const entry: Score = { name: user?.name || "ゲスト", score, ts: Date.now() };
          const next = [...board, entry].sort((a, b) => b.score - a.score).slice(0, 10);
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
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <SectionCard title="ミニゲーム（10秒連打！）" action={<span className="text-sm text-gray-500">トップ10を目指そう</span>}>
        <div className="flex flex-col items-center gap-4 py-4">
          {phase === "ready" && <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={start}>スタート</button>}
          {phase === "count" && <div className="text-4xl font-bold">{countdown}</div>}
          {phase === "play" && (
            <>
              <div className="text-sm text-gray-500">残り {timeLeft} 秒</div>
              <button className="px-6 py-6 rounded-2xl bg-emerald-600 text-white text-xl" onClick={() => setScore((s) => s + 1)}>
                クリック！+1
              </button>
              <div className="text-xl font-bold">スコア：{score}</div>
            </>
          )}
          {phase === "done" && (
            <>
              <div className="text-xl font-bold">結果：{score} pt</div>
              <button className="px-4 py-2 rounded-xl bg-gray-900 text-white" onClick={() => setPhase("ready")}>
                リスタート
              </button>
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard title="ランキング（ローカル）">
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {board.length === 0 && <li className="text-gray-500">まだ記録がありません。</li>}
          {board.map((b, i) => (
            <li key={b.ts + i}>
              {b.name} — <span className="font-semibold">{b.score}</span>（{new Date(b.ts).toLocaleString()}）
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}
