import { useEffect, useState } from "react";
import { SectionCard } from "../../components/Ui";
import CookieClicker from "./CookieClicker";
import TenSecondClicker from "./TenSecondClicker";
import TenSecondStop from "./TenSecondStop";
import React from "react";

export default function GamePage({ user }) {
  const [board, setBoard] = useState(() => {
    const raw = localStorage.getItem("game-board");
    return raw ? JSON.parse(raw) : [];
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <SectionCard
        title="ミニゲーム（10秒連打！）"
        action={
          <span className="text-sm text-gray-500">トップ10を目指そう</span>
        }
      >
        <TenSecondClicker user={user} board={board} setBoard={setBoard} />
      </SectionCard>
      <SectionCard
        title="ミニゲーム（10秒連打！）"
        action={
          <span className="text-sm text-gray-500">トップ10を目指そう</span>
        }
      >
        <TenSecondClicker user={user} board={board} setBoard={setBoard} />
      </SectionCard>

      <SectionCard title="クッキー・クラッカー">
        <CookieClicker />
      </SectionCard>

      <SectionCard title="ランキング（ローカル）">
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {board.length === 0 && (
            <li className="text-gray-500">まだ記録がありません。</li>
          )}
          {board.map((b, i) => (
            <li key={b.ts + i}>
              {b.name} — <span className="font-semibold">{b.score}</span>（
              {new Date(b.ts).toLocaleString()}）
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}
