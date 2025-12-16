import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebase";

export default function PostLend() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [price, setPrice] = useState(0);
  const [free, setFree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("ログインしてください");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // ===== 画像アップロード =====
      if (imageFile) {
        const imageRef = ref(
          storage,
          `posts/${auth.currentUser.uid}/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // ===== Firestore に保存 =====
      await addDoc(collection(db, "posts"), {
        title,
        detail,
        deadline,
        price: free ? 0 : Number(price),
        free,
        type: "lend",
        imageUrl,
        ownerUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // フォーム初期化
      setTitle("");
      setDetail("");
      setDeadline("");
      setPrice(0);
      setFree(false);
      setImageFile(null);

      alert("投稿しました！");
    } catch (err) {
      console.error(err);
      alert("投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">貸したい物の投稿</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold block mb-1">
            掲示板に表示するタイトル
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 写真 */}
        <div>
          <label className="font-semibold block mb-1">写真</label>
          <input
            id="imageFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="imageFileInput"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700"
          >
            📸 写真を挿入
          </label>
          {imageFile && (
            <p className="mt-2 text-sm text-gray-600">
              選択済み: {imageFile.name}
            </p>
          )}
        </div>

        {/* 詳細 */}
        <div>
          <label className="font-semibold block mb-1">詳細情報</label>
          <textarea
            className="w-full p-2 border rounded h-28"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
        </div>

        {/* 期限 */}
        <div>
          <label className="font-semibold block mb-1">貸し出し期限</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        {/* 対価 */}
        <div>
          <label className="font-semibold block mb-1">
            対価（レンタルポイント）
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              className="p-2 border rounded w-40"
              min="0"
              value={price}
              disabled={free}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={free}
                onChange={() => setFree(!free)}
              />
              対価なし（無料で貸す）
            </label>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "投稿中..." : "この内容で投稿する"}
        </button>
      </form>
    </div>
  );
}
