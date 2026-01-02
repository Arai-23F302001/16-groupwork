import {
  doc,
  setDoc,
  increment,
  addDoc,
  collection,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";

export async function addPointToUser(userId, point, gameType) {
  if (point <= 0) return;

  const userRef = doc(db, "users", userId);

  // 🔥 これが最重要
  await setDoc(
    userRef,
    {
      points: increment(point),
    },
    { merge: true }
  );

  await addDoc(collection(db, "pointHistory"), {
    userId,
    gameType,
    point,
    createdAt: new Date(),
  });
}

// 履歴取得（表示用）
export async function fetchPointHistory(userId) {
  const q = query(
    collection(db, "pointHistory"),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function fetchUserPoint(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return 0;
  return snap.data().points ?? 0;
}
