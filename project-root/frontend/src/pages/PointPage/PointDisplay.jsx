import React, { useState, useEffect } from "react";
import { Coins, Gift, ShoppingBag, Check, X } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { consumePoints } from "../../lib/pointRepository";
import ExchangeConfirmModal from "./ExchangeConfirmModal";
import { exchangeItems } from "../../assets/exchangeItem.js";

export default function PointExchangePage({ user }) {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);

  useEffect(() => {
    if (!user) {
      setCurrentPoints(0);
      setIsLoadingPoints(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setCurrentPoints(snap.data().points ?? 0);
        } else {
          setCurrentPoints(0);
        }
        setIsLoadingPoints(false);
      },
      (error) => {
        console.error("❌ ポイント取得エラー:", error);
        setIsLoadingPoints(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);

  // 交換確認モーダルを開く
  const openExchangeModal = (item) => {
    if (!item) return;

    // ポイントが足りるか確認
    if (currentPoints >= item.points) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  const handleExchange = async () => {
    if (!selectedItem || !user || isExchanging) return;

    setIsExchanging(true);

    try {
      await consumePoints({
        userId: user.uid,
        costPoints: selectedItem.points,
        exchangeItems: selectedItem,
      });

      setExchangeSuccess(true);

      setTimeout(() => {
        setShowModal(false);
        setExchangeSuccess(false);
        setSelectedItem(null);
        setIsExchanging(false);
      }, 2000);
    } catch (error) {
      console.error("❌ 交換エラー:", error);
      alert(error.message || "交換に失敗しました");
      setIsExchanging(false);
    }
  };

  if (isLoadingPoints) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            ポイント情報を読み込み中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-purple-600" />
            交換可能な商品
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangeItems.map((exchangeItems) => {
              const canExchange = currentPoints >= exchangeItems.points;

              return (
                <div
                  key={exchangeItems.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    !canExchange ? "opacity-60" : ""
                  }`}
                >
                  {/* 商品画像 */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exchangeItems.image}
                      alt={exchangeItems.name}
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
                      {exchangeItems.category}
                    </div>
                  </div>

                  {/* 商品情報 */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg h-14 line-clamp-2">
                      {exchangeItems.name}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-purple-600">
                          {exchangeItems.points}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                          pt
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        在庫:{" "}
                        <span className="font-semibold">
                          {exchangeItems.stock}
                        </span>
                      </div>
                    </div>

                    {/* 交換ボタン */}
                    <button
                      onClick={() => openExchangeModal(exchangeItems)}
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
      <ExchangeConfirmModal
        open={showModal}
        selectedItem={selectedItem}
        currentPoints={currentPoints}
        isExchanging={isExchanging}
        exchangeSuccess={exchangeSuccess}
        onCancel={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleExchange}
      />
    </div>
  );
}
