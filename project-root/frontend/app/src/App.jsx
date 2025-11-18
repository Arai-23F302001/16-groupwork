import React, { useState } from "react";
import TopBar from "./components/TopBar";
import AuthPage from "./pages/controllers/AuthPage";
import GamePage from "./pages/GamePage/GamePage";
import PostsPage from "./pages/PostsPage";

export default function App() {
  // 型注釈を削除
  const [tab, setTab] = useState("auth");
  const [user, setUser] = useState(null);

  const onLogin = (email) => { setUser({ name: email.split("@")[0] || "user", email }); setTab("posts"); };
  const onSignup = (name, email) => { setUser({ name, email }); setTab("posts"); };
  const onLogout = () => { setUser(null); setTab("auth"); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <TopBar current={tab} onTab={(t) => setTab(t)} user={user} onLogout={onLogout} onGoAuth={() => setTab("auth")} />
      {tab === "auth" && <AuthPage onLogin={onLogin} onSignup={onSignup} />}
      {tab === "game" && <GamePage user={user} />}
      {tab === "posts" && <PostsPage user={user} />}
      <footer className="py-10 text-center text-xs text-gray-400">© 2025 Campus Share Demo</footer>
    </div>
  );
}
