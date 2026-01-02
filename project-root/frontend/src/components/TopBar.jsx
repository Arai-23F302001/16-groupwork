import React, { useState, useRef, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase"; // パスは適宜調整

export default function TopBar({
  current,
  onTab,
  user,
  onLogout,
  onGoAuth,
  profile,
}) {
  const tabs = [
    { key: "posts", label: "掲示板" },
    { key: "game", label: "ミニゲーム" },
    { key: "messages", label: "メッセージ" },
    {
      key: "point",
      label: "ポイント管理",
      submenu: [
        { key: "point-current", label: "現在のポイント", disabled: true }, // ★ リンク無効化
        { key: "point-history", label: "履歴" },
        { key: "point-exchange", label: "交換" },
      ],
    },
    {
      key: "post",
      label: "投稿する",
      submenu: [
        { key: "post-borrow", label: "借りる" },
        { key: "post-lend", label: "貸す" },
      ],
    },
    {
      key: "mypage",
      label: "マイページ",
      submenu: [
        { key: "mypage-profile", label: "プロフィール" },
        { key: "mypage-notify", label: "通知" },
      ],
    },
  ];

  // =============================
  // リアルタイムポイント取得
  // =============================
  const [points, setPoints] = useState(null);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);

  useEffect(() => {
    let unsubSnap = null;

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setPoints(null);
        setIsLoadingPoints(false);
        if (unsubSnap) unsubSnap();
        return;
      }

      setIsLoadingPoints(true);
      const userRef = doc(db, "users", user.uid);

      unsubSnap = onSnapshot(
        userRef,
        (snap) => {
          if (snap.exists()) {
            setPoints(snap.data().points ?? 0);
          } else {
            setPoints(0);
          }
          setIsLoadingPoints(false);
        },
        (error) => {
          console.error("❌ ポイント取得エラー:", error);
          setIsLoadingPoints(false);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubSnap) unsubSnap();
    };
  }, []);

  // =============================
  // Mega Menu 制御
  // =============================
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoverMain, setHoverMain] = useState(null);
  const closeTimer = useRef(null);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false);
      setHoverMain(null);
    }, 180);
  };

  return (
    <header
      className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100"
      onMouseEnter={openMega}
      onMouseLeave={closeMega}
    >
      {/* =============================
          上部ナビゲーション
      ============================== */}
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <div className="w-32 font-bold">Campus Share</div>

        <nav className="flex-1 grid grid-cols-6 gap-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                if (!user) {
                  alert("ログインが必要です");
                  onGoAuth();
                  return;
                }
                onTab(t.key);
              }}
              onMouseEnter={() => setHoverMain(t.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition
                ${
                  current === t.key || hoverMain === t.key
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-200"
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* =============================
            ユーザーエリア
        ============================== */}
        <div className="ml-4 flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user.displayName ?? "ユーザー"} さん
              </span>

              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-semibold">
                    {(user.displayName ?? "U").charAt(0)}
                  </span>
                )}
              </div>

              <button
                className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm"
                onClick={onLogout}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm"
              onClick={onGoAuth}
            >
              ログイン / 新規登録
            </button>
          )}
        </div>
      </div>

      {/* =============================
          Mega Menu
      ============================== */}
      <div
        className={`
          absolute left-0 right-0 z-20
          backdrop-blur-xl bg-white/80 shadow-lg
          transition-all duration-300 overflow-hidden
          ${
            megaOpen
              ? "opacity-100 translate-y-0 max-h-96"
              : "opacity-0 -translate-y-5 max-h-0"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex text-sm">
          <div className="w-32" />

          <div className="flex-1 grid grid-cols-6 gap-6">
            {tabs.map((t, idx) => (
              <div
                key={t.key}
                onMouseEnter={() => setHoverMain(t.key)}
                className={idx > 0 ? "border-l border-gray-100 pl-6" : ""}
              >
                <div
                  className={`rounded-xl px-4 py-3 transition
                    ${hoverMain === t.key ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <div className="font-semibold text-gray-700 mb-3">
                    {t.label}
                  </div>

                  {t.submenu && (
                    <div className="space-y-2">
                      {t.submenu.map((item) => {
                        // ★ ポイント表示の特別UI
                        if (item.key === "point-current") {
                          return (
                            <div key={item.key} className="pointer-events-none">
                              <div className="rounded-lg px-4 py-3 shadow-md">
                                <div className="text-xs opacity-90 mb-1">
                                  現在
                                </div>
                                <div className="text-xl font-bold">
                                  {isLoadingPoints ? (
                                    <span className="text-base">読込中...</span>
                                  ) : points !== null ? (
                                    `${points.toLocaleString()} pt`
                                  ) : (
                                    <span className="text-base">--</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // ★ 通常のメニューアイテム
                        return (
                          <div
                            key={item.key}
                            className={`cursor-pointer text-gray-600 hover:text-indigo-600 ${
                              item.disabled
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            onClick={() => {
                              if (item.disabled) return;
                              if (!user) {
                                alert("ログインしてください");
                                onGoAuth();
                                return;
                              }
                              onTab(item.key);
                              setMegaOpen(false);
                            }}
                          >
                            {item.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
