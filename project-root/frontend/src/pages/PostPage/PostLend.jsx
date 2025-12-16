import React, { useState } from "react";

export default function PostLend({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [price, setPrice] = useState(0);
  const [free, setFree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      imageFile,
      detail,
      deadline,
      price: free ? 0 : price,
      free,
      type: "lend",
    });
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

        {/* 写真 */}
        <div>
          <label className="font-semibold block mb-1">写真</label>

          {/* 隠し file input */}
          <input
            id="imageFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />

          {/* カスタムボタン */}
          <label
            htmlFor="imageFileInput"
            className="
      inline-block
      bg-indigo-600
      text-white
      px-4 py-2
      rounded-lg
      shadow-md
      cursor-pointer
      hover:bg-indigo-700
      active:translate-y-1
      active:shadow-sm
      transition-all
    "
          >
            📸 写真を挿入
          </label>

          {/* 選択されたファイル名を表示 */}
          {imageFile && (
            <p className="mt-2 text-gray-600 text-sm">
              選択済み: {imageFile.name}
            </p>
          )}
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

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
          この内容で投稿する
        </button>
      </form>
    </div>
  );
}
