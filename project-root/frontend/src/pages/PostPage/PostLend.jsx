import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function PostLend() {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [price, setPrice] = useState(0);
  const [free, setFree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("ログインしてください");
      return;
    }

    setLoading(true);

    try {
      // ===== Firestore に保存 =====
      await addDoc(collection(db, "postsLend"), {
        title,
        detail,
        deadline,
        price: free ? 0 : Number(price),
        free,
        ownerUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // フォーム初期化
      setTitle("");
      setDetail("");
      setDeadline("");
      setPrice(0);
      setFree(false);

      alert("投稿しました！");
    } catch (err) {
      console.error(err);
      alert("投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">貸したい物の投稿</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* タイトル */}
        <div>
          <label className="font-semibold block mb-1">
            掲示板に表示するタイトル
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 詳細 */}
        <div>
          <label className="font-semibold block mb-1">詳細情報</label>
          <textarea
            className="w-full p-2 border rounded h-28"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
        </div>

        {/* 期限 */}
        <div>
          <label className="font-semibold block mb-1">貸し出し期限</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        {/* 対価 */}
        <div>
          <label className="font-semibold block mb-1">
            対価（レンタルポイント）
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              className="p-2 border rounded w-40"
              min="0"
              value={price}
              disabled={free}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={free}
                onChange={() => setFree(!free)}
              />
              対価なし（無料で貸す）
            </label>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "投稿中..." : "この内容で投稿する"}
        </button>
      </form>
    </div>
  );
}
