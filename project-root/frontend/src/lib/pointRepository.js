import {
  doc,
  setDoc,
  increment,
  addDoc,
  collection,
  runTransaction,
  onSnapshot,
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

export function subscribeUserPoints(userId, callback) {
  const ref = doc(db, "users", userId);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().points ?? 0 : 0);
  });
}

export async function updateUserPointsTx(userId, updater) {
  const ref = doc(db, "users", userId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("user not found");

    const current = snap.data().points ?? 0;
    const next = updater(current);
    tx.update(ref, { points: next });
  });
}

export async function consumePoints({
  userId,
  costPoints,
  exchangeItem,
}) {
  const userRef = doc(db, "users", userId);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("ユーザーが存在しません");
    }

    const currentPoints = userSnap.data().points ?? 0;

    if (currentPoints < costPoints) {
      throw new Error("ポイントが不足しています");
    }

    // ポイント減算
    transaction.update(userRef, {
      points: currentPoints - costPoints,
    });

  });
}
