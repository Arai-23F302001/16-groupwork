import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { createUserIfNotExists } from "./lib/user"; // ★追加
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

export default function App() {
  const [tab, setTab] = useState("auth");
  const [user, setUser] = useState(null);

  // 🔐 Firebaseログイン状態を監視
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ★ 初ログインなら /users/uid を作成
        await createUserIfNotExists(currentUser);

        setUser(currentUser);
        setTab("posts");
      } else {
        setUser(null);
        setTab("auth");
      }
    });

    return () => unsub();
  }, []);

  // 🚪 ログアウト
  const onLogout = async () => {
    await signOut(auth);
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

      {/* 🔐 認証ページ */}
      {tab === "auth" && <AuthPage />}

      {/* 以下はログイン必須 */}
      {user && tab === "game" && <GamePage user={user} />}
      {user && tab === "posts" && <PostsPage user={user} />}
      {user && tab === "mypage-profile" && <ProfilePage user={user} />}
      {user && tab === "point-exchange" && <PointDisplay user={user} />}
      {user && tab === "point-history" && <PointHistory user={user} />}
      {user && tab === "mypage-notify" && <NotificationPage user={user} />}
      {user && tab === "post-lend" && <PostLend user={user} />}
      {user && tab === "post-borrow" && <PostBorrow user={user} />}

      <footer className="py-10 text-center text-xs text-gray-400">
        © 2025 Campus Share Demo
      </footer>
    </div>
  );
}
