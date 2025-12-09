// PostBoard.jsx
import React, { useState } from "react";

export default function PostBoard({ user }) {
  const [form, setForm] = useState({
    title: "",
    course: "",
    category: "教科書",
    image: "",
  });

  // 投稿処理（ダミー）
  const createItem = (e) => {
    e.preventDefault();
    if (!user) {
      alert("投稿にはログインが必要です");
      return;
    }

    console.log("投稿された内容：", form);
    alert("投稿が完了しました（ダミー）");

    // 入力リセット
    setForm({
      title: "",
      course: "",
      category: "教科書",
      image: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">投稿作成フォーム</h2>

      {!user && (
        <p className="mb-4 text-sm text-red-500">
          ※ 投稿するにはログインが必要です。
        </p>
      )}

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={createItem}
      >
        <div>
          <label className="text-sm text-gray-600">書名 / 教材名</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">授業 / 学部</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">カテゴリ</label>
          <select
            className="w-full rounded-xl border px-3 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {["教科書", "参考書"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">画像URL（任意）</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <button
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm"
            type="submit"
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}
