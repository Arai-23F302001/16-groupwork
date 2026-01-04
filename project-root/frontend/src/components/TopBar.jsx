<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import { LogOut, User2 } from "lucide-react";

function NavButton({ selected, children, onMouseEnter, onClick }) {
  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-xl text-sm font-medium transition",
        "active:scale-[0.98]",
        selected
          ? "bg-gray-900 text-white shadow-sm"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function TopBar({
  current, // ← App 传进来的 tab
=======
import React, { useState, useRef, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase"; // パスは適宜調整

export default function TopBar({
  current,
>>>>>>> main
  onTab,
  user,
  onLogout,
  onGoAuth,
<<<<<<< HEAD
  onMegaChange,
}) {
  const [megaOpen, setMegaOpen] = useState(false);

  // ✅ 被点击/选中的主菜单（用于顶部按钮 & 子菜单整列高亮）
  const [selectedMain, setSelectedMain] = useState("posts");

  const closeTimer = useRef(null);

  // 主菜单结构（按项目需要增删）
  const MAIN = [
    {
      key: "posts",
      label: "投稿",
      children: [
        { key: "post-lend", label: "貸す投稿" },
        { key: "post-borrow", label: "借りたい投稿" },
=======
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
>>>>>>> main
      ],
    },
    {
      key: "game",
      label: "ミニゲーム",
      children: [{ key: "game", label: "ゲーム一覧" }],
    },
    {
      key: "point",
      label: "ポイント",
      children: [
        { key: "point-exchange", label: "ポイント表示/交換" },
        { key: "point-history", label: "履歴" },
      ],
    },
    {
      key: "mypage",
      label: "マイページ",
      children: [
        { key: "mypage-profile", label: "プロフィール" },
        { key: "mypage-notify", label: "通知" },
      ],
    },
  ];

<<<<<<< HEAD
=======
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

>>>>>>> main
  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
    onMegaChange?.(true);
  };

  const closeMega = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false);
      onMegaChange?.(false);
    }, 180);
  };

<<<<<<< HEAD
  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  // ✅ 核心：selectedMain 自动跟随 current（刷新/外部切换也正确）
  useEffect(() => {
    if (!current) return;

    // 1) current 直接是主菜单 key（万一将来你有这种 tab）
    const direct = MAIN.find((m) => m.key === current);
    if (direct) {
      setSelectedMain(direct.key);
      return;
    }

    // 2) current 是子菜单 key（常见情况）
    const parent = MAIN.find((m) => (m.children ?? []).some((c) => c.key === current));
    if (parent) {
      setSelectedMain(parent.key);
    }
    // 3) current = "auth" 或其他不属于 MAIN 的 tab：不改 selectedMain（保持上一次）
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  // 子菜单项是否是当前页
  const isCurrentChild = (childKey) => current === childKey;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="font-black tracking-tight text-lg">Campus Share</div>
          <span className="text-xs text-gray-400">Group16</span>
        </div>

        {/* Top 主菜单 */}
        <nav className="hidden md:flex items-center gap-1" onMouseLeave={closeMega}>
          {MAIN.map((m) => (
            <NavButton
              key={m.key}
              selected={selectedMain === m.key}
              onMouseEnter={openMega}
=======
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
>>>>>>> main
              onClick={() => {
                // ✅ 点击反馈：选中该主菜单 + 打开 mega menu
                setSelectedMain(m.key);
                openMega();
              }}
<<<<<<< HEAD
=======
              onMouseEnter={() => setHoverMain(t.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition
                ${
                  current === t.key || hoverMain === t.key
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-200"
                }`}
>>>>>>> main
            >
              {m.label}
            </NavButton>
          ))}
        </nav>

<<<<<<< HEAD
        {/* 右侧用户信息 */}
        <div className="flex items-center gap-2">
          {!user ? (
            <button
              className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white hover:bg-black transition"
              onClick={onGoAuth}
              type="button"
            >
              ログイン
            </button>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User2 size={16} />
                <span className="max-w-[160px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>
=======
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

>>>>>>> main
              <button
                className="px-3 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2"
                onClick={onLogout}
                type="button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
<<<<<<< HEAD
            </>
=======
            </div>
          ) : (
            <button
              className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm"
              onClick={onGoAuth}
            >
              ログイン / 新規登録
            </button>
>>>>>>> main
          )}
        </div>
      </div>

<<<<<<< HEAD
      {/* Mega Menu：一次性显示全部列，并对 selectedMain 对应列高亮 */}
      {megaOpen && (
        <div
          className="relative z-50 border-t bg-white shadow-sm"
          onMouseEnter={() => {
            clearTimeout(closeTimer.current);
            setMegaOpen(true);
            onMegaChange?.(true);
          }}
          onMouseLeave={closeMega}
        >
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {MAIN.map((m) => {
              const isSelectedCol = selectedMain === m.key;

              return (
                <div
                  key={m.key}
                  className={[
                    "rounded-2xl p-2 transition",
                    isSelectedCol ? "bg-gray-50 ring-1 ring-gray-200" : "",
                  ].join(" ")}
=======
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
>>>>>>> main
                >
                  {/* 列标题：点击可让该列高亮 */}
                  <button
                    type="button"
                    className={[
                      "mb-2 text-sm font-semibold w-full text-left px-2 py-1 rounded-xl transition",
                      isSelectedCol
                        ? "text-gray-900"
                        : "text-gray-600 hover:bg-gray-100",
                    ].join(" ")}
                    onClick={() => setSelectedMain(m.key)}
                  >
                    {m.label}
                  </button>

                  {/* 子菜单项 */}
                  <div className="space-y-1">
                    {(m.children ?? []).map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        className={[
                          "w-full text-left px-3 py-2 rounded-xl text-sm transition",
                          isCurrentChild(c.key)
                            ? "bg-gray-900 text-white"
                            : isSelectedCol
                            ? "text-gray-800 hover:bg-gray-100"
                            : "text-gray-700 hover:bg-gray-100",
                          "active:scale-[0.98]",
                        ].join(" ")}
                        onClick={() => {
                          // ✅ 点子菜单：切页 + 选中列自动跟随（因为 current 会变化触发 useEffect）
                          onTab(c.key);
                          setMegaOpen(false);
                          onMegaChange?.(false);
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
<<<<<<< HEAD
=======

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
>>>>>>> main
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
