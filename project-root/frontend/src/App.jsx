import React, { useState } from "react";
import TopBar from "./components/TopBar";
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage/GamePage";
import PostsPage from "./pages/PostsPage";

export default function App() {
  const [tab, setTab] = useState("posts");
  const [user, setUser] = useState(null); // ← これが必要！

  const onLogin = (email) => {
    setUser({ name: email.split("@")[0] || "user", email });
    setTab("posts");
  };

  const onSignup = (name, email) => {
    setUser({ name, email });
    setTab("posts");
  };

  const onLogout = () => {
    setUser(null);
    setTab("auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <TopBar
        current={tab}
        onTab={(t) => setTab(t)}
        user={user}
        onLogout={onLogout}
        onGoAuth={() => setTab("auth")}
      />

      {tab === "auth" && <AuthPage onLogin={onLogin} onSignup={onSignup} />}
      {tab === "game" && <GamePage user={user} />}
      {tab === "posts" && <PostsPage user={user} />}

<<<<<<< Updated upstream
=======
      {/* ポイント履歴（仮のプレースホルダー） */}
      {tab === "point-history" && (
        <div className="p-6 text-gray-600 text-center">ポイント履歴ページ</div>
      )}

      {/* 投稿する：投稿作成フォーム */}
      {tab === "toukou" && (
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
      )}

      {/* マイページ設定（仮） */}
      {tab === "mypage-setting" && (
        <div className="p-6 text-gray-600 text-center">設定ページ</div>
      )}

>>>>>>> Stashed changes
      <footer className="py-10 text-center text-xs text-gray-400">
        © 2025 Campus Share Demo
      </footer>
    </div>
  );
}
