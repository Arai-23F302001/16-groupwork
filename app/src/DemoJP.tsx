import React, { useMemo, useState } from "react";

// ------------------------------------------------------------
// キャンパス・シェア（日本語UI）ワンファイル・デモ（修正版）
// - 投稿作成フォーム / 管理者承認 / 認証(ログイン・新規登録)
// - JSXの未終了タグを解消：ルート<div> → <Top> → <main> の1構成に統一
// - 純粋関数＋簡易テストを追加
// ------------------------------------------------------------

// 型定義
export type ItemStatus = "募集中" | "承認待ち" | "貸出中" | "返却待ち" | "返却済";
export type Item = {
  id: string;
  title: string;
  course: string;
  category: string;
  status: ItemStatus;
  owner: string;
  image: string;
};
export type Reward = { id: string; name: string; cost: number };

// シードデータ
const seedItems: Item[] = [
  {
    id: "i1",
    title: "線形代数入門（第3版）",
    course: "工学部 1年",
    category: "教科書",
    status: "募集中",
    owner: "先輩A",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "i2",
    title: "新・経済学の基礎",
    course: "経済学部 2年",
    category: "参考書",
    status: "募集中",
    owner: "先輩B",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "i3",
    title: "プログラミングC入門",
    course: "情報科学 1年",
    category: "教科書",
    status: "募集中",
    owner: "先輩C",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
  },
];

const seedRewards: Reward[] = [
  { id: "r1", name: "学食券 300円", cost: 15 },
  { id: "r2", name: "文具券 500円", cost: 25 },
  { id: "r3", name: "カフェドリンク券", cost: 18 },
];

// UI ヘルパー
function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const map: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    gray: "bg-gray-50 text-gray-700 ring-gray-200",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  };
  return (
    <span className={`inline-flex items-center rounded-xl px-2 py-1 text-xs font-medium ring-1 ${map[color] || map.blue}`}>
      {children}
    </span>
  );
}

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

// 純粋関数（テスト用）
export function statusColor(st: ItemStatus): "green" | "amber" | "indigo" | "blue" | "gray" {
  switch (st) {
    case "募集中":
      return "green";
    case "承認待ち":
      return "amber";
    case "貸出中":
      return "indigo";
    case "返却待ち":
      return "blue";
    case "返却済":
      return "gray";
    default:
      return "blue";
  }
}

export function simulateBorrow(currentBorrowPt: number, itemStatus: ItemStatus) {
  if (currentBorrowPt < 2) return { allowed: false, message: "借りポイント不足", newPt: currentBorrowPt, newStatus: itemStatus };
  if (itemStatus !== "募集中") return { allowed: false, message: "募集中ではない", newPt: currentBorrowPt, newStatus: itemStatus };
  return { allowed: true, message: "申請→承認待ち", newPt: currentBorrowPt - 2, newStatus: "承認待ち" as ItemStatus };
}

export function simulateRedeem(currentRedeemPt: number, cost: number) {
  if (currentRedeemPt < cost) return { ok: false, left: currentRedeemPt };
  return { ok: true, left: currentRedeemPt - cost };
}

export function __tests__() {
  const results: { name: string; pass: boolean }[] = [];
  results.push({ name: "statusColor 募集中→green", pass: statusColor("募集中") === "green" });
  results.push({ name: "statusColor 承認待ち→amber", pass: statusColor("承認待ち") === "amber" });
  const b1 = simulateBorrow(1, "募集中");
  results.push({ name: "borrow: ポイント不足", pass: b1.allowed === false && b1.message.includes("不足") });
  const b2 = simulateBorrow(3, "貸出中");
  results.push({ name: "borrow: 募集中以外は不可", pass: b2.allowed === false });
  const b3 = simulateBorrow(3, "募集中");
  results.push({ name: "borrow: 正常→承認待ち", pass: b3.allowed && b3.newPt === 1 && b3.newStatus === "承認待ち" });
  const r1 = simulateRedeem(10, 15);
  results.push({ name: "redeem: 不足", pass: r1.ok === false && r1.left === 10 });
  const r2 = simulateRedeem(20, 15);
  results.push({ name: "redeem: 正常", pass: r2.ok === true && r2.left === 5 });
  return results;
}

// ヘッダー
function Top({ user, onLoginClick, onLogout, tab, onTab }: {
  user: { name: string; email: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  tab: string;
  onTab: (t: string) => void;
}) {
  const tabs = [
    { key: "board", label: "掲示板" },
    { key: "post", label: "投稿" },
    { key: "rewards", label: "景品交換" },
    { key: "mypage", label: "マイページ" },
    { key: "admin", label: "管理" },
  ];
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-indigo-600" />
          <div className="font-bold">Campus Share</div>
        </div>
        <nav className="ml-6 flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? "bg-indigo-600 text-white shadow" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-gray-600">{user.name} さん</div>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm">ログアウト</button>
            </>
          ) : (
            <button onClick={onLoginClick} className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm">ログイン / 新規登録</button>
          )}
        </div>
      </div>
    </header>
  );
}

// 認証ビュー
function AuthView({ onLogin, onSignup }: {
  onLogin: (email: string) => void;
  onSignup: (name: string, email: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email);
  }
  function doSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    onSignup(name, email);
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setMode("login")} className={`px-3 py-1.5 rounded-xl text-sm ${mode === "login" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>ログイン</button>
        <button onClick={() => setMode("signup")} className={`px-3 py-1.5 rounded-xl text-sm ${mode === "signup" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>新規登録</button>
      </div>
      {mode === "login" ? (
        <form onSubmit={doLogin} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">メールアドレス</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="student@stu.teikyo.ac.jp" />
          </div>
          <div>
            <label className="text-sm text-gray-600">パスワード</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">ログイン</button>
        </form>
      ) : (
        <form onSubmit={doSignup} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">お名前</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="山田 太郎" />
          </div>
          <div>
            <label className="text-sm text-gray-600">メールアドレス</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="student@stu.teikyo.ac.jp" />
          </div>
          <div>
            <label className="text-sm text-gray-600">パスワード</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="8文字以上" />
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">登録する</button>
        </form>
      )}
      <div className="mt-4 text-xs text-gray-500">※ デモのため実在の認証は行いません。入力内容は保存されません。</div>
    </div>
  );
}

// メイン
export default function DemoJP() {
  // 認証状態
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [tab, setTab] = useState("board");
  const [items, setItems] = useState<Item[]>(seedItems);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("すべて");
  const [toast, setToast] = useState<string | null>(null);
  // ポイント
  const [borrowPt, setBorrowPt] = useState(0);
  const [redeemPt, setRedeemPt] = useState(0);
  // 履歴
  const [history, setHistory] = useState<{ type: string; text: string; ts: number }[]>([]);
  // 投稿フォーム
  const [form, setForm] = useState({ title: "", course: "", category: "教科書", image: "" });

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const okQ = query
        ? `${it.title}${it.course}${it.category}${it.owner}`.toLowerCase().includes(query.toLowerCase())
        : true;
      const okC = cat === "すべて" ? true : it.category === cat;
      return okQ && okC;
    });
  }, [items, query, cat]);

  // 操作
  function handleBorrow(itemId: string) {
    if (!user) { setToast("ログインが必要です"); setTab("auth"); return; }
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) return;
    if (borrowPt < 2) { setToast("借りポイントが不足しています（必要：2）"); return; }
    const it = items[idx];
    if (it.status !== "募集中") { setToast("この教材は現在お借りできません"); return; }
    const next = [...items];
    next[idx] = { ...it, status: "承認待ち" };
    setItems(next);
    setBorrowPt((v) => v - 2);
    setHistory((h) => [{ type: "loan", text: `『${it.title}』を申請しました（-2 借りP）`, ts: Date.now() }, ...h]);
    setToast("申請しました。承認をお待ちください。");
  }

  function approveAll() {
    const changed = items.some((it) => it.status === "承認待ち");
    if (!changed) { setToast("承認待ちはありません"); return; }
    setItems((arr) => arr.map((it) => (it.status === "承認待ち" ? { ...it, status: "貸出中" } : it)));
    setToast("すべて承認 → 貸出中に更新しました（デモ）");
  }

  function adminApprove(itemId: string) {
    setItems((arr) => arr.map((it) => (it.id === itemId && it.status === "承認待ち" ? { ...it, status: "貸出中" } : it)));
    setToast("承認しました（デモ）");
  }

  function adminReject(itemId: string) {
    let refunded = false;
    setItems((arr) => arr.map((it) => {
      if (it.id === itemId && it.status === "承認待ち") { refunded = true; return { ...it, status: "募集中" }; }
      return it;
    }));
    if (refunded) {
      setBorrowPt((p) => p + 2);
      setHistory((h) => [{ type: "reject", text: `申請が却下されました（+2 借りP 返還・デモ）`, ts: Date.now() }, ...h]);
    }
    setToast("却下しました（デモ）");
  }

  function markReturned(itemId?: string) {
    let updated = false;
    setItems((arr) => arr.map((it) => {
      if ((itemId ? it.id === itemId : it.status === "貸出中") && it.status === "貸出中") { updated = true; return { ...it, status: "返却済" }; }
      return it;
    }));
    if (updated) {
      setRedeemPt((p) => p + 10);
      setHistory((h) => [{ type: "return", text: `返却完了。貸し手に +10 引き換えP（デモ）`, ts: Date.now() }, ...h]);
      setToast("返却が完了しました（デモ）。引き換えポイント+10");
    } else {
      setToast("返却可能なアイテムがありません");
    }
  }

  function redeem(rewardId: string) {
    if (!user) { setToast("ログインが必要です"); setTab("auth"); return; }
    const r = seedRewards.find((r) => r.id === rewardId); if (!r) return;
    if (redeemPt < r.cost) { setToast("引き換えポイントが不足しています"); return; }
    setRedeemPt((p) => p - r.cost);
    setHistory((h) => [{ type: "reward", text: `${r.name} を交換しました（-${r.cost} 引き換えP）`, ts: Date.now() }, ...h]);
    setToast(`${r.name} を交換申請しました（デモ）`);
  }

  function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setToast("ログインが必要です"); setTab("auth"); return; }
    const id = `i${Math.random().toString(36).slice(2, 8)}`;
    const imageFallback = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop";
    const newItem: Item = {
      id,
      title: form.title.trim() || "無題の教材",
      course: form.course.trim() || "学部 未設定",
      category: form.category,
      status: "募集中",
      owner: user?.name || "あなた",
      image: form.image.trim() || imageFallback,
    };
    setItems([newItem, ...items]);
    setForm({ title: "", course: "", category: "教科書", image: "" });
    setHistory((h) => [{ type: "post", text: `『${newItem.title}』を出品しました`, ts: Date.now() }, ...h]);
    setToast("投稿を作成しました（募集中）");
    setTab("board");
  }

  const pending = items.filter((it) => it.status === "承認待ち");
  const showAuth = !user || tab === "auth";

  // 認証ハンドラ
  const onLogin = (email: string) => {
    const displayName = email.split("@")[0];
    setUser({ name: displayName, email });
    setBorrowPt(10);
    setRedeemPt(8);
    setHistory((h) => [{ type: "auth", text: `ログイン：${displayName}`, ts: Date.now() }, ...h]);
    setTab("board");
    setToast("ログインしました（デモ）");
  };
  const onSignup = (name: string, email: string) => {
    setUser({ name, email });
    setBorrowPt(12);
    setRedeemPt(10);
    setHistory((h) => [{ type: "auth", text: `新規登録：${name}`, ts: Date.now() }, ...h]);
    setTab("board");
    setToast("登録が完了しました（デモ）");
  };
  const onLogout = () => {
    setUser(null); setBorrowPt(0); setRedeemPt(0); setTab("auth"); setToast("ログアウトしました");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Top user={user} onLoginClick={() => setTab("auth")} onLogout={onLogout} tab={tab} onTab={setTab} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {showAuth ? (
          <AuthView onLogin={onLogin} onSignup={onSignup} />
        ) : (
          <>
            {/* 概要カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard
                title="ポイント"
                action={<button className="text-sm px-3 py-1.5 rounded-xl bg-gray-100" onClick={() => setTab("mypage")}>詳細</button>}
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <div className="text-sm text-gray-500">借りポイント</div>
                    <div className="text-xl font-bold">{borrowPt}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <div className="text-sm text-gray-500">引き換えポイント</div>
                    <div className="text-xl font-bold">{redeemPt}</div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="クイック操作">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={approveAll} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm">承認（デモ）</button>
                  <button onClick={() => markReturned()} className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">返却処理（デモ）</button>
                  <button onClick={() => setRedeemPt((p) => p + 5)} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm">引き換えP +5（デモ）</button>
                </div>
              </SectionCard>

              <SectionCard title="ヒント">
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>「掲示板」で教材を検索→申請</li>
                  <li>「投稿」で新しい教材を出品</li>
                  <li>「管理」で申請を承認/却下</li>
                  <li>「景品交換」でポイントを使って交換</li>
                </ul>
              </SectionCard>
            </div>

            {/* 掲示板 */}
            {tab === "board" && (
              <SectionCard title="掲示板" action={<Badge color="gray">デモ用データ</Badge>}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="キーワード検索（書名・授業名・カテゴリ）"
                    className="w-full md:flex-1 rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2"
                  >
                    {["すべて", "教科書", "参考書"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button onClick={() => setTab("post")} className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">出品する</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filtered.map((it) => (
                    <div key={it.id} className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden shadow-sm">
                      <div className="aspect-[4/3] bg-gray-100">
                        <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold leading-tight">{it.title}</h3>
                          <Badge color={statusColor(it.status)}>{it.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-500">{it.course}・{it.category}</div>
                        <div className="text-xs text-gray-400">提供者：{it.owner}</div>
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleBorrow(it.id)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm disabled:opacity-40"
                            disabled={it.status !== "募集中"}
                          >
                            借りる（-2）
                          </button>
                          <button
                            onClick={() => markReturned(it.id)}
                            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm"
                          >
                            返却（デモ）
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">条件に合う投稿が見つかりませんでした。</div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* 投稿 */}
            {tab === "post" && (
              <SectionCard title="投稿作成フォーム" action={<Badge color="gray">ログイン必須</Badge>}>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={createItem}>
                  <div>
                    <label className="text-sm text-gray-600">書名 / 教材名</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
                      placeholder="例：線形代数入門（第3版）"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">授業 / 学部</label>
                    <input
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
                      placeholder="例：工学部 1年"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">カテゴリ</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    >
                      {["教科書", "参考書"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">画像URL（任意）</label>
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">投稿する</button>
                    <button type="button" onClick={() => setTab("board")} className="px-4 py-2 rounded-xl bg-gray-100 text-sm">一覧へ戻る</button>
                  </div>
                </form>
              </SectionCard>
            )}

            {/* 景品交換 */}
            {tab === "rewards" && (
              <SectionCard title="景品交換" action={<Badge color="gray">学内限定 想定</Badge>}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {seedRewards.map((r) => (
                    <div key={r.id} className="bg-white rounded-2xl ring-1 ring-gray-100 p-4 flex flex-col gap-2">
                      <div className="text-base font-semibold">{r.name}</div>
                      <div className="text-sm text-gray-500">必要ポイント：{r.cost}</div>
                      <button
                        onClick={() => redeem(r.id)}
                        className="mt-auto px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm"
                      >
                        交換する
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* マイページ */}
            {tab === "mypage" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SectionCard title="残高">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">借りポイント</div>
                      <div className="text-xl font-bold">{borrowPt}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">引き換えポイント</div>
                      <div className="text-xl font-bold">{redeemPt}</div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="履歴">
                  <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                    {history.length === 0 && (
                      <li className="text-sm text-gray-500">まだ履歴がありません。</li>
                    )}
                    {history.map((h, i) => (
                      <li key={i} className="text-sm text-gray-700">{new Date(h.ts).toLocaleString()} — {h.text}</li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title="ガイド">
                  <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                    <li>掲示板で教材を探して「借りる」を押す（借りポイントを消費）。</li>
                    <li>承認後に「貸出中」になり、返却後にポイント付与。</li>
                    <li>十分な引き換えポイントで景品に交換できます。</li>
                    <li>自分の教材を出品するには「投稿」から。</li>
                  </ol>
                  <div className="mt-3 text-xs text-gray-400">※ このデモでは操作を簡略化しています。</div>
                </SectionCard>
              </div>
            )}

            {/* 管理 */}
            {tab === "admin" && (
              <SectionCard title="管理者承認画面" action={<Badge color="gray">デモ：運営想定</Badge>}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">承認待ち：{pending.length} 件</div>
                  <div className="flex items-center gap-2">
                    <button onClick={approveAll} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm">すべて承認</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pending.map((it) => (
                    <div key={it.id} className="bg-white rounded-2xl ring-1 ring-gray-100 p-4 flex gap-3 items-start">
                      <div className="w-24 h-16 bg-gray-100 overflow-hidden rounded-xl">
                        <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{it.title}</div>
                          <Badge color="amber">承認待ち</Badge>
                        </div>
                        <div className="text-xs text-gray-500">{it.course}・{it.category}・提供者：{it.owner}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => adminApprove(it.id)} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm">承認</button>
                          <button onClick={() => adminReject(it.id)} className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm">却下</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pending.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">現在、承認待ちはありません。</div>
                  )}
                </div>
              </SectionCard>
            )}
          </>
        )}
      </main>

      {/* トースト */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
          <button className="ml-3 underline" onClick={() => setToast(null)}>閉じる</button>
        </div>
      )}

      <footer className="py-10 text-center text-xs text-gray-400">© 2025 Campus Share Demo</footer>
    </div>
  );
}
