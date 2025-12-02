import React, { useState } from "react";
import TopBar from "./components/TopBar";
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage";
import PostsPage from "./pages/PostsPage";

export default function App() {
  const [tab, setTab] = useState("auth");
  const [user, setUser] = useState(null);

  // ログイン処理
  const onLogin = (userData) => {
    setUser(userData);
    setTab("posts");
  };

  // サインアップ処理
  const onSignup = async (email, password) => {
    if (!email || !password) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("サインアップ成功！自動でログインします");

        // サインアップ成功後にログイン扱いにする
        setUser(data.user);
        setTab("posts");
      } else {
        alert(data.message || "サインアップ失敗");
      }
    } catch (err) {
      console.error(err);
      alert("サーバーエラー");
    }
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
            {tab === "point-history" && (
        <div className="p-6 text-gray-600 text-center">ポイント履歴ページ</div>
      )}
      {tab === "toukou-article" && (
        <div className="p-6 text-gray-600 text-center">記事投稿ページ</div>
      )}
      {tab === "mypage-setting" && (
        <div className="p-6 text-gray-600 text-center">設定ページ</div>
      )}

      <footer className="py-10 text-center text-xs text-gray-400">
        © 2025 Campus Share Demo
      </footer>
    </div>
  );
}
