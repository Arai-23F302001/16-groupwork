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
import DMPage from "./pages/DM/DMPage";
import MessagesPage from "./pages/DM/MessagePage.jsx";

import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("auth");
  const [user, setUser] = useState(null);
  // DM用
  const [dmTargetUid, setDmTargetUid] = useState(null);
  const [dmPostId, setDmPostId] = useState(null);

  // 🔐 ログイン監視
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

  // 🔔 DM通知（これ1つだけ）
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
  //プロフィール画像用
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data());
      }
    });

    return () => unsub();
  }, [user]);

  // 💬 DMを開く
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
        profile={profile} // ★追加
        onLogout={onLogout}
        onGoAuth={() => setTab("auth")}
      />

      {tab === "auth" && <AuthPage />}

      {user && tab === "posts" && (
        <PostsPage user={user} onOpenDM={handleOpenDM} />
      )}

      {user && tab === "messages" && (
        <MessagesPage user={user} onOpenDM={handleOpenDM} />
      )}

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
      {user && tab === "mypage-notify" && (
        <NotificationPage user={user} onOpenDM={handleOpenDM} />
      )}
      {user && tab === "post-lend" && <PostLend user={user} />}
      {user && tab === "post-borrow" && <PostBorrow user={user} />}

      <footer className="py-10 text-center text-xs text-gray-400">
        © 2025 Campus Share Demo
      </footer>
    </div>
  );
}
