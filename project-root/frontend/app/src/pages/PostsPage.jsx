import { useMemo, useState } from "react";
import { SectionCard, Badge } from "../components/Ui";
import { seedItems } from "../lib/types";
import { statusColor } from "../lib/utils";

export default function PostsPage({ user }) {
  const [items, setItems] = useState(seedItems);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("すべて");
  const [form, setForm] = useState({ title: "", course: "", category: "教科書", image: "" });

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const okQ = query ? `${it.title}${it.course}${it.category}${it.owner}`.toLowerCase().includes(query.toLowerCase()) : true;
      const okC = cat === "すべて" ? true : it.category === cat;
      return okQ && okC;
    });
  }, [items, query, cat]);

  function createItem(e) {
    e.preventDefault();
    if (!user) return alert("ログインが必要です");
    const id = `i${Math.random().toString(36).slice(2, 8)}`;
    const fallback = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop";
    const newItem = {
      id,
      title: form.title.trim() || "無題の教材",
      course: form.course.trim() || "学部 未設定",
      category: form.category,
      status: "募集中",
      owner: user?.name || "あなた",
      image: form.image.trim() || fallback,
    };
    setItems([newItem, ...items]);
    setForm({ title: "", course: "", category: "教科書", image: "" });
    alert("投稿を作成しました（デモ）");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="投稿作成フォーム" action={<Badge className="bg-gray-100 ring-gray-200">ログイン必須</Badge>}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={createItem}>
            <div>
              <label className="text-sm text-gray-600">書名 / 教材名</label>
              <input className="w-full rounded-xl border px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-gray-600">授業 / 学部</label>
              <input className="w-full rounded-xl border px-3 py-2" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-600">カテゴリ</label>
              <select className="w-full rounded-xl border px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["教科書", "参考書"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">画像URL（任意）</label>
              <input className="w-full rounded-xl border px-3 py-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">投稿する</button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="検索 / フィルター">
          <div className="flex flex-col md:flex-row gap-3">
            <input className="w-full md:flex-1 rounded-xl border px-3 py-2" placeholder="キーワード" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="rounded-xl border px-3 py-2" value={cat} onChange={(e) => setCat(e.target.value)}>
              {["すべて", "教科書", "参考書"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="掲示板">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((it) => (
            <div key={it.id} className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-gray-100">
                <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-tight">{it.title}</h3>
                  <span className={`inline-flex items-center rounded-xl px-2 py-1 text-xs font-medium ring-1 ${statusColor(it.status)}`}>{it.status}</span>
                </div>
                <div className="text-sm text-gray-500">{it.course}・{it.category}</div>
                <div className="text-xs text-gray-400">提供者：{it.owner}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">条件に合う投稿がありません。</div>}
        </div>
      </SectionCard>
    </div>
  );
}
