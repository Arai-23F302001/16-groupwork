<<<<<<< Updated upstream
import React from "react";
export default function TopBar({ current, onTab, user, onLogout, onGoAuth }) {
  const tabs = [
    { key: "posts", label: "投稿" },
    { key: "game", label: "ミニゲーム" },
  ];

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="font-bold">Campus Share</div>
        <nav className="ml-4 flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                current === t.key ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name} さん</span>
              <button className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm" onClick={onLogout}>
                ログアウト
              </button>
            </>
          ) : (
            <button className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm" onClick={onGoAuth}>
              ログイン / 新規登録
            </button>
          )}
        </div>
      </div>
    </header>
=======
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar";
import AuthPage from "../pages/AuthPage";
import HomePage from "../App";
import BorrowPage from "../pages/PostPage/PostBorrow";
import LendPage from "../pages/PostPage/PostLend";
import NotificationPage from "../pages/MyPage/NotificationPage";

export default function App() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(null); // ← ログイン状態
  const [sidebarOpen, setSidebarOpen] = useState(false);
  <button
    className="md:hidden px-3 py-2 text-gray-700"
    onClick={() => setSidebarOpen(true)}
  >
    ☰
  </button>;

  // まだログインしていなければ AuthPage を表示
  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex">
        {/* ← タブメニュー（サイドバー） */}
        <Sidebar tab={tab} setTab={setTab} />

        {/* ← メイン画面 */}
        <div className="flex-1 p-4">
          {tab === "home" && <HomePage user={user} />}

          {tab === "post-borrow" && <BorrowPage user={user} />}
          {tab === "post-lend" && <LendPage user={user} />}

          {tab === "mypage-notify" && <NotificationPage user={user} />}
        </div>
      </div>
    </Router>
>>>>>>> Stashed changes
  );
}