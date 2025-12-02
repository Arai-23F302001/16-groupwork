// TopBar.jsx
import React, { useState, useRef } from "react";

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
    { key: "toukou", label: "投稿する" },
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

  // Mega メニューの開閉状態
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef(null);

  // 「いまどのタブ列に乗っているか」（上のボタンと下の列を同期させる）
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
      {/* ▼ 上部ナビゲーションバー */}
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3 relative">
        {/* ロゴ：下の MegaMenu でも同じ幅のダミーを置く */}
        <div className="w-32 font-bold">Campus Share</div>

        {/* 上側メニュー：5列グリッドにする（下の列と合わせる） */}
        <nav className="flex-1 grid grid-cols-5 gap-10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              onMouseEnter={() => setHoverMain(t.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium text-left transition
                ${
                  // 現在のタブ or ホバー中タブは強くハイライト
                  current === t.key || hoverMain === t.key
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-200"
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* 右上ユーザーエリア */}
        <div className="ml-4 flex items-center gap-2">
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

      {/* ▼ Mega Menu 本体 */}
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
          {/* ロゴ分のダミー幅（上の w-32 と合わせる） */}
          <div className="w-32" />
          {/* 下側 5 列グリッド（上の nav と同じ構造） */}
          <div className="flex-1 grid grid-cols-5 gap-10">
            {tabs.map((t, idx) => (
              <div
                key={t.key}
                onMouseEnter={() => setHoverMain(t.key)}
                className={idx > 0 ? "border-l border-gray-100 pl-6 pt-1" : "pt-1"}
              >
                {/* 列全体のホバー背景（Apple っぽいカード） */}
                <div
                  className={`
                    rounded-xl px-4 py-3 transition
                    ${
                      hoverMain === t.key
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="font-semibold text-gray-700 mb-3">
                    {t.label}
                  </div>

                  {t.submenu ? (
                    <div className="space-y-2">
                      {t.submenu.map((item) => (
                        <div
                          key={item.key}
                          className="cursor-pointer text-gray-600 hover:text-indigo-600 transition"
                          onClick={() => {
                            onTab(item.key);
                            setMegaOpen(false);
                          }}
                        >
                          {/* 下線アニメーション風 */}
                          <span className="inline-block border-b-2 border-transparent hover:border-indigo-500 pb-0.5">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs">（サブメニューなし）</div>
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
