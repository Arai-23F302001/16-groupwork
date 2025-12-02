import React, { useState, useRef } from "react";

export default function TopBar({ current, onTab, user, onLogout, onGoAuth }) {
  const tabs = [
    {
      key: "posts",
      label: "掲示板",
    },
    {
      key: "game",
      label: "ミニゲーム",
    },
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
      key: "toukou",
      label: "投稿する",
      submenu: [
        { key: "toukou-article", label: "記事投稿" },
        { key: "toukou-image", label: "画像投稿" },
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

  const [hoveredTab, setHoveredTab] = useState(null);
  const closeTimer = useRef(null);

  // ▼ メニュー表示を開始
  const handleMouseEnter = (key) => {
    clearTimeout(closeTimer.current);
    setHoveredTab(key);
  };

  // ▼ 少し遅れてメニューを閉じる
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setHoveredTab(null);
    }, 250); // ← 250ミリ秒待つ
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 relative">
        <div className="font-bold">Campus Share</div>

        <nav className="ml-4 flex items-center gap-1">
          {tabs.map((t) => (
            <div
              key={t.key}
              className="relative"
              onMouseEnter={() => handleMouseEnter(t.key)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => onTab(t.key)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                  current === t.key
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>

              {/* ▼ 子菜单 */}
              {t.submenu && (
                <div
                  className={`absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20 transition-all duration-200 transform ${
                    hoveredTab === t.key
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  // ▼ 鼠标进入子菜单时也清除关闭定时器
                  onMouseEnter={() => clearTimeout(closeTimer.current)}
                  onMouseLeave={handleMouseLeave}
                >
                  {t.submenu.map((item) => (
                    <div
                      key={item.key}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        onTab(item.key);
                        setHoveredTab(null);
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ▼ 右上のログインエリア */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name} さん</span>
              <button
                className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm"
                onClick={onLogout}
              >
                ログアウト
              </button>
            </>
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
    </header>
  );
}
