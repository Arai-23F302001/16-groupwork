// TopBar.jsx
import React, { useState, useRef, useEffect } from "react";

export default function TopBar({ current, onTab, user, onLogout, onGoAuth }) {
  const tabs = [
    { key: "posts", label: "掲示板" },
    { key: "game", label: "ミニゲーム" },
    {
      key: "point",
      label: "ポイント管理",
      submenu: [
        { key: "point-current", label: "現在のポイント" },
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
        { key: "mypage-setting", label: "設定" },
      ],
    },
  ];

  // ★ サーバーから取得するポイント
  const [point, setPoint] = useState(null);

  // ★ 疑似サーバー API
  const fetchPoint = async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(500000), 1000);
    });
  };

  useEffect(() => {
    fetchPoint().then((p) => setPoint(p));
  }, []);

  // Mega Menu 関連
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef(null);
  const [hoverMain, setHoverMain] = useState(null);

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
      {/* 上部ナビゲーションバー */}
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3 relative">
        <div className="w-32 font-bold">Campus Share</div>

        <nav className="flex-1 grid grid-cols-5 gap-10">
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
              className={`px-3 py-1.5 rounded-xl text-sm font-medium text-left transition
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

        {/* ユーザーエリア */}
        <div className="ml-4 flex items-center gap-2">
          {/* ユーザーエリア */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* ユーザー名 */}
              <span className="text-sm text-gray-600">
                {user.displayName ?? "ユーザー"} さん
              </span>

              {/* ユーザーアイコン */}
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="user icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {(user.displayName ?? "U").charAt(0)}
                  </span>
                )}
              </div>

              {/* ログアウト */}
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

      {/* ▼ Mega Menu */}
      <div
        className={`
          absolute left-0 right-0 z-20
          backdrop-blur-xl bg-white/80 shadow-lg
          transition-all duration-300
          overflow-hidden transform
          ${
            megaOpen
              ? "opacity-100 translate-y-0 max-h-96 ease-out"
              : "opacity-0 -translate-y-5 max-h-0 ease-in"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex text-sm">
          <div className="w-32" />
          <div className="flex-1 grid grid-cols-5 gap-10">
            {tabs.map((t, idx) => (
              <div
                key={t.key}
                onMouseEnter={() => setHoverMain(t.key)}
                className={
                  idx > 0 ? "border-l border-gray-100 pl-6 pt-1" : "pt-1"
                }
              >
                <div
                  className={`
                    rounded-xl px-4 py-3 transition min-h-32
                    ${hoverMain === t.key ? "bg-gray-50" : "hover:bg-gray-50"}
                  `}
                >
                  <div className="font-semibold text-gray-700 mb-3">
                    {t.label}
                  </div>

                  {/* ▼ submenu がある場合だけ表示（無い場合は空欄を維持） */}
                  {t.submenu && (
                    <div className="space-y-2">
                      {t.submenu.map((item) => (
                        <div
                          key={item.key}
                          className="cursor-pointer text-gray-600 hover:text-indigo-600 transition"
                          onClick={() => {
                            if (!user) {
                              alert("ログインしてください");
                              onGoAuth();
                              return;
                            }
                            onTab(item.key);
                            setMegaOpen(false);
                          }}
                        >
                          <span className="inline-block border-b-2 border-transparent hover:border-indigo-500 pb-0.5">
                            {item.label}
                          </span>

                          {item.key === "point-current" && point !== null && (
                            <span className="ml-2 text-xs text-gray-500">
                              （{point.toLocaleString()} pt）
                            </span>
                          )}
                        </div>
                      ))}
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
