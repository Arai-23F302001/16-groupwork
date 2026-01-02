import { Check, X } from "lucide-react";

export default function ExchangeConfirmModal({
  open,
  selectedItem,
  currentPoints,
  isExchanging,
  exchangeSuccess,
  onCancel,
  onConfirm,
}) {
  if (!open || !selectedItem) return null;

  return (
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
            <p className="text-gray-600">{selectedItem.name}と交換しました</p>
          </div>
        ) : (
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
                <div className="border-t border-gray-200 pt-2 mt-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">交換後のポイント</span>
                  <span className="font-bold text-blue-600">
                    {currentPoints - selectedItem.points} pt
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isExchanging}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isExchanging}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg disabled:opacity-50"
                >
                  {isExchanging ? "処理中..." : "交換する"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
