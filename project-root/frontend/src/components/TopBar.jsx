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
  onTab,
  user,
  onLogout,
  onGoAuth,
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
              onClick={() => {
                // ✅ 点击反馈：选中该主菜单 + 打开 mega menu
                setSelectedMain(m.key);
                openMega();
              }}
            >
              {m.label}
            </NavButton>
          ))}
        </nav>

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
              <button
                className="px-3 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2"
                onClick={onLogout}
                type="button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </>
          )}
        </div>
      </div>

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
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
