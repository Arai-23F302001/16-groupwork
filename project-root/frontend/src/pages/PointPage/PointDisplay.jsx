import React, { useState, useEffect } from "react";
import { Coins, Gift, ShoppingBag, Check, X } from "lucide-react";

export default function PointExchangePage({ user }) {
  // 現在のポイント（ダミーデータ、実際はAPIから取得）
  const [currentPoints, setCurrentPoints] = useState(1500);

  // 交換モーダルの状態
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  // 交換可能な商品リスト（実際はAPIから取得）
  const [items, setItems] = useState([
    {
      id: 1,
      name: "スターバックスカード 500円分",
      points: 500,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      category: "ドリンク",
      stock: 10,
    },
    {
      id: 2,
      name: "Amazonギフト券 1000円分",
      points: 1000,
      image:
        "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&fit=crop",
      category: "ギフト券",
      stock: 20,
    },
    {
      id: 3,
      name: "学食無料券",
      points: 300,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      category: "食事",
      stock: 15,
    },
    {
      id: 4,
      name: "図書カード 500円分",
      points: 500,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      category: "書籍",
      stock: 8,
    },
    {
      id: 5,
      name: "マクドナルド 500円セット",
      points: 450,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      category: "食事",
      stock: 12,
    },
    {
      id: 6,
      name: "コンビニ商品券 300円分",
      points: 300,
      image:
        "https://images.unsplash.com/photo-1555529902-5261145633bf?w=400&h=300&fit=crop",
      category: "その他",
      stock: 25,
    },
  ]);

  // 交換確認モーダルを開く
  const openExchangeModal = (item) => {
    if (currentPoints >= item.points) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  // 交換処理
  const handleExchange = async () => {
    if (!selectedItem) return;

    // 実際はここでAPIリクエストを送信
    // await fetch('/api/points/exchange', { method: 'POST', body: JSON.stringify({ itemId: selectedItem.id }) });

    // ポイントを減算
    setCurrentPoints(currentPoints - selectedItem.points);

    // 成功表示
    setExchangeSuccess(true);

    // モーダルを閉じる
    setTimeout(() => {
      setShowModal(false);
      setExchangeSuccess(false);
      setSelectedItem(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ポイント残高表示 */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-2">
                    あなたの保有ポイント
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold">
                      {currentPoints.toLocaleString()}
                    </span>
                    <span className="text-2xl font-semibold">pt</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Coins className="w-16 h-16" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 px-8 py-4">
              <p className="text-sm text-gray-700">
                <Gift className="w-4 h-4 inline mr-2" />
                ポイントを使って素敵な商品と交換しよう！
              </p>
            </div>
          </div>
        </div>

        {/* 商品一覧 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-purple-600" />
            交換可能な商品
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const canExchange = currentPoints >= item.points;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    !canExchange ? "opacity-60" : ""
                  }`}
                >
                  {/* 商品画像 */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {!canExchange && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                          ポイント不足
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </div>
                  </div>

                  {/* 商品情報 */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg h-14 line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-purple-600">
                          {item.points}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                          pt
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        在庫:{" "}
                        <span className="font-semibold">{item.stock}</span>
                      </div>
                    </div>

                    {/* 交換ボタン */}
                    <button
                      onClick={() => openExchangeModal(item)}
                      disabled={!canExchange}
                      className={`w-full py-3 rounded-xl font-semibold transition-all transform ${
                        canExchange
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {canExchange ? "交換する" : "ポイントが足りません"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 交換確認モーダル */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            {exchangeSuccess ? (
              // 成功画面
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  交換完了！
                </h3>
                <p className="text-gray-600">
                  {selectedItem.name}と交換しました
                </p>
              </div>
            ) : (
              // 確認画面
              <>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <h3 className="text-2xl font-bold">交換確認</h3>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <h4 className="font-bold text-xl text-gray-800 mb-2">
                      {selectedItem.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      この商品と交換しますか？
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">必要ポイント</span>
                      <span className="font-bold text-purple-600">
                        {selectedItem.points} pt
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">現在のポイント</span>
                      <span className="font-bold">{currentPoints} pt</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">交換後のポイント</span>
                      <span className="font-bold text-blue-600">
                        {currentPoints - selectedItem.points} pt
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedItem(null);
                      }}
                      className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleExchange}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                    >
                      交換する
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
