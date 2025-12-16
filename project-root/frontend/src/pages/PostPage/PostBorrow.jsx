import React, { useState } from "react";

export default function PostBorrow({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      itemName,
      detail,
      deadline,
      price,
      type: "borrow",
    });
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

        {/* 借りたいものの名前 */}
        <div>
          <label className="font-semibold block mb-1">借りたいものの名前</label>
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
            対価（レンタルポイント）
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
          この内容で投稿する
        </button>
      </form>
    </div>
  );
}
