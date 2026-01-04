import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { createUserIfNotExists } from "./lib/user";

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

import DMPage from "./pages/DM/DMPage";
import MessagesPage from "./pages/DM/MessagePage.jsx";

import { doc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("auth");
  const [user, setUser] = useState(null);

  // ✅ Mega Menu 背景遮罩
  const [navOpen, setNavOpen] = useState(false);

  // DM用
  const [dmTargetUid, setDmTargetUid] = useState(null);
  const [dmPostId, setDmPostId] = useState(null);

  // 🔐 登录状态监听
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
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

  // 🔔 DM通知（只有一个监听）
  useEffect(() => {
    if (!user || tab === "dm") return;

    const q = query(
      collection(db, "notifications"),
      where("toUid", "==", user.uid),
      where("type", "==", "dm"),
      where("read", "==", false),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) return;

      const latest = snap.docs[0].data();
      const open = window.confirm("新しいDMが届きました。開きますか？");

      if (open) {
        setDmTargetUid(latest.fromUid);
        setDmPostId(latest.postId);
        setTab("dm");
      }
    });

    return () => unsub();
  }, [user, tab]);

  // 🚪 ログアウト
  const onLogout = async () => {
    await signOut(auth);
    setUser(null);
    setTab("auth");
  };

  // 👤 プロフィール（头像/信息）监听
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data());
    });

    return () => unsub();
  }, [user]);

  // 💬 打开 DM
  const handleOpenDM = (partnerUid, postId) => {
    if (!partnerUid || partnerUid === user?.uid) return;
    setDmTargetUid(partnerUid);
    setDmPostId(postId);
    setTab("dm");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <TopBar
        current={tab}
        onTab={setTab}
        user={user}
        profile={profile}
        onLogout={onLogout}
        onGoAuth={() => setTab("auth")}
        onMegaChange={setNavOpen}
      />

      {/* ✅ 遮罩：从 TopBar 下方开始（不挡顶部菜单） */}
      <div
        className={`fixed inset-0 top-[64px] z-10 transition-opacity duration-200 ${
          navOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      </div>

      {/* 主体内容（方案1：不对 main 做 blur） */}
      <main className="transition duration-200">
        {tab === "auth" && <AuthPage />}

        {user && tab === "posts" && <PostsPage user={user} onOpenDM={handleOpenDM} />}

        {user && tab === "messages" && <MessagesPage user={user} onOpenDM={handleOpenDM} />}

        {user && tab === "dm" && dmTargetUid && dmPostId && (
          <DMPage
            user={user}
            partnerUid={dmTargetUid}
            postId={dmPostId}
            onBack={() => {
              setDmTargetUid(null);
              setDmPostId(null);
              setTab("messages");
            }}
          />
        )}

        {user && tab === "game" && <GamePage user={user} />}
        {user && tab === "mypage-profile" && <ProfilePage user={user} />}
        {user && tab === "point-exchange" && <PointDisplay user={user} />}
        {user && tab === "point-history" && <PointHistory user={user} />}
        {user && tab === "mypage-notify" && <NotificationPage user={user} onOpenDM={handleOpenDM} />}
        {user && tab === "post-lend" && <PostLend user={user} />}
        {user && tab === "post-borrow" && <PostBorrow user={user} />}

        <footer className="py-10 text-center text-xs text-gray-400">© 2025 Campus Share Demo</footer>
      </main>
    </div>
  );
}
