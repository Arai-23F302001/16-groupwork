import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function PostBorrow() {
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
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
      await addDoc(collection(db, "postsBorrow"), {
        title,
        itemName,
        detail,
        deadline,
        maxPrice: Number(maxPrice),
        ownerUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // フォーム初期化
      setTitle("");
      setItemName("");
      setDetail("");
      setDeadline("");
      setMaxPrice(0);

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
      <h2 className="text-xl font-semibold mb-4">借りたい物の投稿</h2>

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

        {/* 借りたい物の名前 */}
        <div>
          <label className="font-semibold block mb-1">
            借りたい物の名前
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
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
          <label className="font-semibold block mb-1">必要な期限</label>
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
            支払える上限（レンタルポイント）
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            required
          />
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
