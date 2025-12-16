import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { SectionCard } from "../../components/Ui";
import { statusColor } from "../../lib/utils";

export default function PostsPage() {
  const [items, setItems] = useState([]);
  const [userMap, setUserMap] = useState({}); // uid -> displayName
  const [queryText, setQueryText] = useState("");
  const [cat, setCat] = useState("すべて");
  const [loading, setLoading] = useState(true);

  // =============================
  // posts 取得
  // =============================
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const posts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ===== ownerUid を収集 =====
      const uids = [...new Set(posts.map((p) => p.ownerUid).filter(Boolean))];

      // ===== users 取得 =====
      const users = {};
      await Promise.all(
        uids.map(async (uid) => {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            users[uid] = userSnap.data().displayName;
          } else {
            users[uid] = "名無し";
          }
        })
      );

      setUserMap(users);

      // ===== 表示用に整形 =====
      const list = posts.map((p) => ({
        id: p.id,
        title: p.title,
        course: "未設定",
        category: "教科書",
        status: p.free ? "無料" : "募集中",
        ownerUid: p.ownerUid,
        image:
          p.imageUrl ||
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
      }));

      setItems(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // =============================
  // 検索・フィルタ
  // =============================
  const filtered = useMemo(() => {
    return items.filter((it) => {
      const ownerName = userMap[it.ownerUid] || "";
      const okQ = queryText
        ? `${it.title}${it.category}${ownerName}`
            .toLowerCase()
            .includes(queryText.toLowerCase())
        : true;
      const okC = cat === "すべて" ? true : it.category === cat;
      return okQ && okC;
    });
  }, [items, queryText, cat, userMap]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 検索 */}
      <SectionCard title="検索 / フィルター">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="w-full md:flex-1 rounded-xl border px-3 py-2"
            placeholder="キーワード"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
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

      {/* 掲示板 */}
      <SectionCard title="掲示板">
        {loading && (
          <div className="text-center py-10 text-gray-500">
            読み込み中...
          </div>
        )}

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

                <div className="text-xs text-gray-400">
                  提供者：
                  {userMap[it.ownerUid] || "名無し"}
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              投稿がありません
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
