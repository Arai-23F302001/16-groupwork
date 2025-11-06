export default function TopBar({
  current,
  onTab,
  user,
  onLogout,
  onGoAuth,
}: {
  current: string;
  onTab: (t: string) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onGoAuth: () => void;
}) {
  const tabs = [
    { key: "posts", label: "投稿" },
    { key: "game", label: "ミニゲーム" },
  ];
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="font-bold">Campus Share</div>
        <nav className="ml-4 flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                current === t.key ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name} さん</span>
              <button className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm" onClick={onLogout}>
                ログアウト
              </button>
            </>
          ) : (
            <button className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm" onClick={onGoAuth}>
              ログイン / 新規登録
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
