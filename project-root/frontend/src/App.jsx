import React, { useState } from "react";
import TopBar from "./components/TopBar";
<<<<<<< HEAD:project-root/frontend/app/src/App.jsx
import AuthPage from "./pages/controllers/AuthPage";
import GamePage from "./pages/GamePage/GamePage";
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
=======
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage";
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
>>>>>>> takei:project-root/frontend/src/App.jsx
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
<<<<<<< HEAD:project-root/frontend/app/src/App.jsx
      {tab === "auth" && <AuthPage onLogin={onLogin} onSignup={onSignup} />}
      {tab === "game" && <GamePage user={user} />}
      {tab === "posts" && <PostsPage user={user} />}
=======

      {tab === "auth" && <AuthPage onLogin={onLogin} onSignup={onSignup} />}
      {tab === "game" && <GamePage user={user} />}
      {tab === "posts" && <PostsPage user={user} />}

>>>>>>> takei:project-root/frontend/src/App.jsx
      <footer className="py-10 text-center text-xs text-gray-400">
        © 2025 Campus Share Demo
      </footer>
    </div>
  );
}
