import React, { useState } from "react";
import TopBar from "./components/TopBar";
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage/GamePage";
import PostsPage from "./pages/PostPage/PostsPage";
import ProfilePage from "./pages/MyPage/ProfilePage";
import PointDisplay from "./pages/PointPage/PointDisplay";
import PointHistory from "./pages/PointPage/PointHistory";
import NotificationPage from "./pages/MyPage/NotificationPage";
import PostLend from "./pages/PostPage/PostLend";
import PostBorrow from "./pages/PostPage/PostBorrow";
import PostBoard from "./pages/PostBoad";

export default function App() {
  const [tab, setTab] = useState("auth");
  const [user, setUser] = useState(null);

  // 投稿フォーム用の状態
  const [form, setForm] = useState({
    title: "",
    course: "",
    category: "教科書",
    image: "",
  });

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

  // ログアウト処理
  const onLogout = () => {
    setUser(null);
    setTab("auth");
  };
  {
    tab === "posts" && <PostBoard user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <TopBar
        current={tab}
        onTab={(t) => setTab(t)}
        user={user}
        onLogout={onLogout}
        onGoAuth={() => setTab("auth")}
      />

      {/* 認証ページ */}
      {tab === "auth" && <AuthPage onLogin={onLogin} onSignup={onSignup} />}

      {/* ミニゲーム */}
      {tab === "game" && <GamePage user={user} />}

      {/* 掲示板（一覧） */}
      {tab === "posts" && <PostsPage user={user} />}

      {/* ポイント履歴（仮のプレースホルダー） */}
      {tab === "point-history" && (
        <div className="p-6 text-gray-600 text-center">ポイント履歴ページ</div>
      )}
      {tab === "mypage-profile" && <ProfilePage user={user} />}
      {tab === "point-exchange" && <PointDisplay user={user} />}
      {tab === "point-history" && <PointHistory user={user} />}
      {tab === "mypage-notify" && <NotificationPage user={user} />}
      {tab === "post-lend" && <PostLend user={user} />}
      {tab === "post-borrow" && <PostBorrow user={user} />}

      {/* マイページ設定（仮） */}
      {tab === "mypage-setting" && (
        <div className="p-6 text-gray-600 text-center">設定ページ</div>
      )}

      <footer className="py-10 text-center text-xs text-gray-400">
        © 2025 Campus Share Demo
      </footer>
    </div>
  );
}
