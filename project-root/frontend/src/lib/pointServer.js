import { doc, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export async function addPointToUser(userId, point, gameType) {
  if (point <= 0) return;

  // 合計ポイント加算
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    point: increment(point),
  });

  // 履歴保存
  await addDoc(collection(db, "pointHistory"), {
    userId,
    gameType,
    point,
    createdAt: new Date(),
  });
}
