import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function DMPage({ targetUid }) {
  // =============================
  // 🔑 UID整理
  // =============================
  const myUid = auth.currentUser?.uid;
  const partnerUid = targetUid; // ★ 方法Bの核心

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // =============================
  // 🏠 roomId を一意に生成
  // =============================
  const roomId = useMemo(() => {
    if (!myUid || !partnerUid) return null;
    return [myUid, partnerUid].sort().join("_");
  }, [myUid, partnerUid]);

  // =============================
  // 📩 メッセージ購読
  // =============================
  useEffect(() => {
    if (!roomId) return;

    // ルームがなければ作成（初DM対策）
    setDoc(
      doc(db, "dmRooms", roomId),
      {
        members: {
          [myUid]: true,
          [partnerUid]: true,
        },
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    const q = query(
      collection(db, "dmRooms", roomId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [roomId, myUid, partnerUid]);

  // =============================
  // ✉️ メッセージ送信
  // =============================
  const sendMessage = async () => {
    if (!text.trim() || !roomId) return;

    await addDoc(collection(db, "dmRooms", roomId, "messages"), {
      text,
      senderUid: myUid,
      createdAt: serverTimestamp(),
    });

    // ルームの最終更新時刻
    await setDoc(
      doc(db, "dmRooms", roomId),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );

    setText("");
  };

  // =============================
  // 🚫 相手未選択
  // =============================
  if (!partnerUid) {
    return (
      <div className="text-center text-gray-500 py-10">
        DM相手が選択されていません
      </div>
    );
  }

  // =============================
  // 🖥️ UI
  // =============================
  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
      <h2 className="text-xl font-semibold mb-4">DM</h2>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-xl max-w-xs break-words
              ${
                m.senderUid === myUid
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* 入力欄 */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メッセージを入力"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 rounded-xl"
        >
          送信
        </button>
      </div>
    </div>
  );
}
