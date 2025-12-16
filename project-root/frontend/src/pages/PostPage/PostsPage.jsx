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

export default function PostsPage({ onOpenDM }) {
  const [items, setItems] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [queryText, setQueryText] = useState("");
  const [cat, setCat] = useState("すべて");
  const [loading, setLoading] = useState(true);

  // =============================
  // 投稿クリック → DMを開く
  // =============================
  const handleOpenDM = (post) => {
    if (!post.ownerUid) return;
    onOpenDM(post.ownerUid);
  };

  // =============================
  // postsLend + postsBorrow 取得
  // =============================
  useEffect(() => {
    let lendPosts = [];
    let borrowPosts = [];

    const updateItems = async () => {
      const all = [...lendPosts, ...borrowPosts];

      // 投稿者 uid を収集
      const uids = [...new Set(all.map((p) => p.ownerUid).filter(Boolean))];

      const users = {};
      await Promise.all(
        uids.map(async (uid) => {
          const snap = await getDoc(doc(db, "users", uid));
          users[uid] = snap.exists() ? snap.data().displayName : "名無し";
        })
      );
      setUserMap(users);

      // 表示用データ
      const list = all
        .sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        )
        .map((p) => ({
          id: p.id,
          title: p.title,
          kind: p.kind,
          badge: p.kind === "lend" ? "貸す" : "借る",
          category: p.kind === "lend" ? "貸したい" : "借りたい",
          status:
            p.kind === "lend"
              ? p.free
                ? "無料"
                : "募集中"
              : "借りたいです",
          ownerUid: p.ownerUid,
          image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
        }));

      setItems(list);
      setLoading(false);
    };

    const unsubLend = onSnapshot(
      query(collection(db, "postsLend"), orderBy("createdAt", "desc")),
      (snap) => {
        lendPosts = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          kind: "lend",
        }));
        updateItems();
      }
    );

    const unsubBorrow = onSnapshot(
      query(collection(db, "postsBorrow"), orderBy("createdAt", "desc")),
      (snap) => {
        borrowPosts = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          kind: "borrow",
        }));
        updateItems();
      }
    );

    return () => {
      unsubLend();
      unsubBorrow();
    };
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
            {["すべて", "貸したい", "借りたい"].map((c) => (
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
              onClick={() => handleOpenDM(it)}
              className={`relative cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm ring-1
                ${
                  it.kind === "lend"
                    ? "ring-indigo-200"
                    : "ring-orange-200"
                }`}
            >
              <div
                className={`absolute top-2 left-2 z-10 rounded-full px-3 py-1 text-xs font-bold text-white
                  ${
                    it.kind === "lend"
                      ? "bg-indigo-600"
                      : "bg-orange-500"
                  }`}
              >
                {it.badge}
              </div>

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

                <div
                  className={`text-sm font-medium ${
                    it.kind === "lend"
                      ? "text-indigo-600"
                      : "text-orange-600"
                  }`}
                >
                  {it.category}
                </div>

                <div className="text-xs text-gray-400">
                  投稿者：{userMap[it.ownerUid] || "名無し"}
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
