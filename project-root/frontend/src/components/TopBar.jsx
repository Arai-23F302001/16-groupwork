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
  current,
  onTab,
  user,
  profile,
  onLogout,
  onGoAuth,
  onMegaChange,
}) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [selectedMain, setSelectedMain] = useState("posts");
  const closeTimer = useRef(null);

  const MAIN = [
    {
      key: "posts",
      label: "投稿",
      children: [
        { key: "post-lend", label: "貸す投稿" },
        { key: "post-borrow", label: "借りたい投稿" },
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

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  // ⭐ selectedMain 自动跟随 current
  useEffect(() => {
    if (!current) return;

    const parent = MAIN.find(
      (m) => m.key === current || (m.children ?? []).some((c) => c.key === current)
    );
    if (parent) setSelectedMain(parent.key);
  }, [current]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ✅ Logo + Text (click to home) */}
        <button
          type="button"
          onClick={() => {
            setSelectedMain("posts");
            onTab("posts");         // ✅ 回主页
            setMegaOpen(false);     // ✅ 关 mega menu
            onMegaChange?.(false);  // ✅ 关背景遮罩/虚化
          }}
          className="group flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-100 transition"
          aria-label="Go to Home"
        >
          {/* 小logo：纯CSS，不依赖图片 */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-bold shadow-sm">
            CS
          </span>
          <span className="font-black tracking-tight text-lg group-hover:underline underline-offset-4">
            Campus Share
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1" onMouseLeave={closeMega}>
          {MAIN.map((m) => (
            <NavButton
              key={m.key}
              selected={selectedMain === m.key}
              onMouseEnter={openMega}
              onClick={() => {
                setSelectedMain(m.key);
                openMega();
              }}
            >
              {m.label}
            </NavButton>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <button
              className="px-3 py-2 rounded-xl bg-gray-900 text-white"
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
                  {profile?.displayName || user.email}
                </span>
              </div>
              <button
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                onClick={onLogout}
                type="button"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {megaOpen && (
        <div
          className="relative z-50 border-t bg-white shadow-sm"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {MAIN.map((m) => (
              <div
                key={m.key}
                className={`rounded-2xl p-2 ${
                  selectedMain === m.key ? "bg-gray-50 ring-1 ring-gray-200" : ""
                }`}
              >
                <div className="mb-2 text-sm font-semibold">{m.label}</div>

                {m.children?.map((c) => (
                  <button
                    key={c.key}
                    className="block w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-100"
                    type="button"
                    onClick={() => {
                      onTab(c.key);
                      setMegaOpen(false);
                      onMegaChange?.(false);
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
