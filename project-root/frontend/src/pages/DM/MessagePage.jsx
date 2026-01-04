import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function MessagesPage({ user, onOpenDM }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "dmRooms"),
      where(`members.${user.uid}`, "==", true),
      orderBy("updatedAt", "desc") // ★ 最新DMが一番上
    );

    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">メッセージ</h2>

      {rooms.map((room) => {
        const partnerUid = Object.keys(room.members).find(
          (uid) => uid !== user.uid
        );

        return (
          <div
            key={room.id}
            onClick={() => onOpenDM(partnerUid, room.postId)}
            className="p-4 bg-white rounded-xl shadow cursor-pointer"
          >
            <div className="text-sm text-gray-600">
              {room.lastMessage || "（まだメッセージはありません）"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
