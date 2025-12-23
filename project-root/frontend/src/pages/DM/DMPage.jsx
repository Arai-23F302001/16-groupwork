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
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function DMPage({ user, partnerUid, postId, onBack }) {
  const myUid = user?.uid;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const roomId = useMemo(() => {
    if (!myUid || !partnerUid || !postId) return null;
    return `${postId}_${[myUid, partnerUid].sort().join("_")}`;
  }, [myUid, partnerUid, postId]);

  // 🔹 ルーム作成 + メッセージ購読
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "dmRooms", roomId);

    // ★ 必ず作る（updatedAt を最初から持たせる）
    setDoc(
      roomRef,
      {
        members: {
          [myUid]: true,
          [partnerUid]: true,
        },
        postId,
        lastMessage: "",
        lastSenderUid: null,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    const q = query(
      collection(db, "dmRooms", roomId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [roomId]);

  // 🔹 既読処理
  useEffect(() => {
    if (!roomId || !myUid) return;

    const q = query(
      collection(db, "notifications"),
      where("toUid", "==", myUid),
      where("roomId", "==", roomId),
      where("read", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      snap.docs.forEach((d) => updateDoc(d.ref, { read: true }));
    });

    return () => unsub();
  }, [roomId, myUid]);

  // 🔹 送信
  const sendMessage = async () => {
    if (!text.trim() || !roomId) return;

    const roomRef = doc(db, "dmRooms", roomId);

    await addDoc(collection(roomRef, "messages"), {
      text,
      senderUid: myUid,
      createdAt: serverTimestamp(),
    });

    // ★ MessagesPage を即更新させる核心
    await updateDoc(roomRef, {
      lastMessage: text,
      lastSenderUid: myUid,
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
      toUid: partnerUid,
      fromUid: myUid,
      type: "dm",
      roomId,
      postId,
      text,
      read: false,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
      <button onClick={onBack} className="text-indigo-600 mb-2">← 戻る</button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-xl max-w-xs ${
              m.senderUid === myUid
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
