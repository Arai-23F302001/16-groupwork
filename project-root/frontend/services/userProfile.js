import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// プロフィール画像URLを保存
export const saveProfileImage = async (uid, imageUrl) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    avatarUrl: imageUrl,
    updatedAt: new Date(),
  });
};

// プロフィール情報を取得
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return null;
  return snap.data();
};
