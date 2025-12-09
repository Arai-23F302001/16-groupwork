import { useMemo, useState } from "react";
import { SectionCard, Badge } from "../../components/Ui";
import { seedItems } from "../../lib/type";
import { statusColor } from "../../lib/utils";
import React from "react";

export default function PostsPage({ user }) {
  const [items, setItems] = useState(seedItems);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("すべて");
  const [form, setForm] = useState({
    title: "",
    course: "",
    category: "教科書",
    image: "",
  });

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const okQ = query
        ? `${it.title}${it.course}${it.category}${it.owner}`
            .toLowerCase()
            .includes(query.toLowerCase())
        : true;
      const okC = cat === "すべて" ? true : it.category === cat;
      return okQ && okC;
    });
  }, [items, query, cat]);

  function createItem(e) {
    e.preventDefault();
    if (!user) return alert("ログインが必要です");
    const id = `i${Math.random().toString(36).slice(2, 8)}`;
    const fallback =
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop";
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
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <SectionCard
          title="検索 / フィルター"
          className="min-h-[300px] md:w-[80%]"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="w-full md:flex-1 rounded-xl border px-3 py-2"
              placeholder="キーワード"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="rounded-xl border px-3 py-2"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
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
            <div
              key={it.id}
              className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden shadow-sm"
            >
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={it.image}
                  alt={it.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-tight">{it.title}</h3>
                  <span
                    className={`inline-flex items-center rounded-xl px-2 py-1 text-xs font-medium ring-1 ${statusColor(
                      it.status
                    )}`}
                  >
                    {it.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {it.course}・{it.category}
                </div>
                <div className="text-xs text-gray-400">提供者：{it.owner}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              条件に合う投稿がありません。
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
