import { useEffect, useState } from "react";
import { SectionCard } from "../../components/Ui";
import CookieClicker from "./CookieClicker";
import TenSecondClicker from "./TenSecondClicker";
import TenSecondStop from "./TenSecondStop";
import React from "react";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function GamePage({ user }) {
  const [board, setBoard] = useState(() => {
    const raw = localStorage.getItem("game-board");
    return raw ? JSON.parse(raw) : [];
  });

  const [isSaving, setIsSaving] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  // 初回マウント時にFirebaseから現在のポイントを取得
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!auth.currentUser) return;

      try {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setTotalPoints(data.points || 0);
        }
      } catch (error) {
        console.error("ポイント取得エラー:", error);
      }
    };

    fetchUserPoints();
  }, []);

  // ランクアップ時のFirebase保存処理
  const handleRankUp = async (points, rankLabel) => {
    if (!auth.currentUser) {
      console.error("ユーザーがログインしていません");
      return;
    }

    setIsSaving(true);
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);

      // ドキュメントが存在するか確認
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // 新規ユーザーの場合、ドキュメントを作成
        await setDoc(userRef, {
          points: points,
          lastRank: rankLabel,
          lastUpdated: new Date(),
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || "Anonymous",
        });
      } else {
        // 既存ユーザーの場合、ポイントを加算
        await updateDoc(userRef, {
          points: increment(points),
          lastRank: rankLabel,
          lastUpdated: new Date(),
        });
      }

      // ローカルの表示も更新
      setTotalPoints((prev) => prev + points);

      console.log(
        `✅ ${points}ポイントをFirebaseに保存しました (${rankLabel})`
      );
    } catch (error) {
      console.error("❌ Firebase保存エラー:", error);
      alert("ポイントの保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 保存状態の表示 */}
      {isSaving && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-center">
          💾 ポイントを保存中...
        </div>
      )}

      {/* 合計ポイント表示 */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center">
        <div className="text-sm opacity-90">累計ポイント</div>
        <div className="text-3xl font-bold">
          {totalPoints.toLocaleString()} pt
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard title="10秒ぴったり押し">
          <TenSecondStop />
        </SectionCard>

        <SectionCard
          title="10秒連打"
          action={
            <span className="text-sm text-gray-500">トップ10を目指そう</span>
          }
        >
          <TenSecondClicker user={user} board={board} setBoard={setBoard} />
        </SectionCard>

        <SectionCard title="クッキー・クラッカー">
          <CookieClicker onRankUp={handleRankUp} />
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
    </div>
  );
}
