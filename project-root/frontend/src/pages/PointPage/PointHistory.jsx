import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Gift,
  Trophy,
  Gamepad2,
} from "lucide-react";

export default function PointHistoryPage({ user }) {
  // ポイント履歴データ（実際はAPIから取得）
  const [history, setHistory] = useState([
    {
      id: 1,
      type: "earn",
      points: 100,
      description: "ミニゲームクリア",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      date: "2025-12-09 14:30",
      icon: "game",
    },
    {
      id: 2,
      type: "spend",
      points: -500,
      description: "スターバックスカード 500円分",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop",
      date: "2025-12-09 13:15",
      icon: "gift",
    },
    {
      id: 3,
      type: "earn",
      points: 200,
      description: "デイリーログインボーナス",
      image:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=100&h=100&fit=crop",
      date: "2025-12-09 09:00",
      icon: "trophy",
    },
    {
      id: 4,
      type: "spend",
      points: -300,
      description: "学食無料券",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop",
      date: "2025-12-08 18:45",
      icon: "gift",
    },
    {
      id: 5,
      type: "earn",
      points: 150,
      description: "ミニゲームクリア",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      date: "2025-12-08 16:20",
      icon: "game",
    },
    {
      id: 6,
      type: "earn",
      points: 50,
      description: "投稿ボーナス",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=100&h=100&fit=crop",
      date: "2025-12-08 12:00",
      icon: "trophy",
    },
    {
      id: 7,
      type: "spend",
      points: -1000,
      description: "Amazonギフト券 1000円分",
      image:
        "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
      date: "2025-12-07 20:30",
      icon: "gift",
    },
    {
      id: 8,
      type: "earn",
      points: 300,
      description: "ウィークリーチャレンジ達成",
      image:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&h=100&fit=crop",
      date: "2025-12-07 15:10",
      icon: "trophy",
    },
    {
      id: 9,
      type: "earn",
      points: 100,
      description: "ミニゲームクリア",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      date: "2025-12-07 11:45",
      icon: "game",
    },
    {
      id: 10,
      type: "spend",
      points: -450,
      description: "マクドナルド 500円セット",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
      date: "2025-12-06 19:20",
      icon: "gift",
    },
  ]);

  // 獲得と使用の合計を計算
  const totalEarned = history
    .filter((h) => h.type === "earn")
    .reduce((sum, h) => sum + h.points, 0);

  const totalSpent = Math.abs(
    history
      .filter((h) => h.type === "spend")
      .reduce((sum, h) => sum + h.points, 0)
  );

  // アイコンを取得
  const getIcon = (iconType) => {
    switch (iconType) {
      case "game":
        return <Gamepad2 className="w-4 h-4" />;
      case "trophy":
        return <Trophy className="w-4 h-4" />;
      case "gift":
        return <Gift className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ポイント履歴
          </h1>
          <p className="text-gray-600">あなたのポイント獲得・使用履歴</p>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* 獲得ポイント合計 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">総獲得ポイント</p>
                <p className="text-3xl font-bold text-red-500">
                  +{totalEarned.toLocaleString()}
                  <span className="text-lg ml-1">pt</span>
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* 使用ポイント合計 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">総使用ポイント</p>
                <p className="text-3xl font-bold text-blue-500">
                  -{totalSpent.toLocaleString()}
                  <span className="text-lg ml-1">pt</span>
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <TrendingDown className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 履歴リスト */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">取引履歴</h2>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* 画像 */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.description}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 ${
                        item.type === "earn" ? "bg-red-500" : "bg-blue-500"
                      } rounded-full p-1.5 shadow-lg`}
                    >
                      {getIcon(item.icon)}
                      <span className="text-white text-xs">
                        {item.type === "earn" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* 説明文 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                      {item.description}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* ポイント表示 */}
                  <div className="flex-shrink-0 text-right">
                    <div
                      className={`text-3xl font-bold ${
                        item.type === "earn" ? "text-red-500" : "text-blue-500"
                      }`}
                    >
                      {item.type === "earn" ? "+" : ""}
                      {item.points.toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-gray-500 mt-1">
                      ポイント
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 履歴がない場合 */}
          {history.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">まだ履歴がありません</p>
            </div>
          )}
        </div>

        {/* フィルターボタン（オプション） */}
        <div className="mt-6 flex justify-center gap-3">
          <button className="px-5 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow font-medium text-gray-700 border-2 border-transparent hover:border-purple-300">
            すべて
          </button>
          <button className="px-5 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow font-medium text-red-500 border-2 border-transparent hover:border-red-300">
            獲得のみ
          </button>
          <button className="px-5 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow font-medium text-blue-500 border-2 border-transparent hover:border-blue-300">
            使用のみ
          </button>
        </div>
      </div>
    </div>
  );
}
