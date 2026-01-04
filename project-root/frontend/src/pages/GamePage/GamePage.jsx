import { useEffect, useState } from "react";
import { SectionCard } from "../../components/Ui";
import CookieClicker from "./CookieClicker";
import TenSecondClicker from "./TenSecondClicker";
import TenSecondStop from "./TenSecondStop";
import { addPointToUser } from "../../lib/pointRepository";
import { auth } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function GamePage({ user }) {
  const [isSaving, setIsSaving] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    let unsubSnap = null;

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setTotalPoints(0);
        if (unsubSnap) unsubSnap();
        return;
      }

      const userRef = doc(db, "users", user.uid);

      unsubSnap = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setTotalPoints(snap.data().points ?? 0);
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubSnap) unsubSnap();
    };
  }, []);

  //ポイント計算
  const handleGameResult = async (points, gameType) => {
    if (!auth.currentUser || points <= 0) return;

    setIsSaving(true);
    try {
      await addPointToUser(auth.currentUser.uid, points, gameType);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRankUp = async (points, rankLabel) => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    try {
      await addPointToUser(auth.currentUser.uid, points, "cookieClicker");
    } catch (error) {
      console.error("❌ ポイント保存エラー:", error);
      alert("ポイントの保存に失敗しました。");
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
          <TenSecondStop onFinish={handleGameResult} />
        </SectionCard>

        <SectionCard
          title="10秒連打"
          action={
            <span className="text-sm text-gray-500">トップ10を目指そう</span>
          }
        >
          <TenSecondClicker
            user={user}
            board={board}
            setBoard={setBoard}
            onFinish={handleGameResult}
          />
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
