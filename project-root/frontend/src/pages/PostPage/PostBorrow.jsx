import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import imageCompression from "browser-image-compression";

export default function PostBorrow() {
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🖼️ 画像関連のstate
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // 🖼️ 画像を選択
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ファイル形式チェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    // ファイルサイズチェック(10MB以下)
    if (file.size > 10 * 1024 * 1024) {
      alert("ファイルサイズは10MB以下にしてください");
      return;
    }

    setSelectedImage(file);

    // プレビュー表示
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🖼️ 画像を圧縮
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      console.log("元のサイズ:", (file.size / 1024 / 1024).toFixed(2), "MB");
      const compressedFile = await imageCompression(file, options);
      console.log(
        "圧縮後のサイズ:",
        (compressedFile.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      return compressedFile;
    } catch (error) {
      console.error("圧縮エラー:", error);
      return file;
    }
  };

  // 🖼️ Cloudinaryにアップロード
  const uploadToCloudinary = async (file) => {
    // ✅ Vite用の環境変数(import.meta.envを使う)
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET_BORROW;

    console.log("Cloud Name:", CLOUD_NAME);
    console.log("Upload Preset:", UPLOAD_PRESET);

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinaryの設定が見つかりません。.envファイルを確認してください。"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "アップロードに失敗しました"
        );
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinaryアップロードエラー:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("ログインしてください");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // 🖼️ 画像が選択されていればアップロード
      if (selectedImage) {
        console.log("📸 画像を圧縮中...");
        const compressedImage = await compressImage(selectedImage);

        console.log("☁️ Cloudinaryにアップロード中...");
        imageUrl = await uploadToCloudinary(compressedImage);
        console.log("✅ アップロード完了:", imageUrl);
      }

      // ===== Firestore に保存 =====
      await addDoc(collection(db, "postsBorrow"), {
        title,
        itemName,
        detail,
        deadline,
        maxPrice: Number(maxPrice),
        imageUrl,
        ownerUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // フォーム初期化
      setTitle("");
      setItemName("");
      setDetail("");
      setDeadline("");
      setMaxPrice(0);
      setSelectedImage(null);
      setPreviewUrl("");

      alert("投稿しました!");
    } catch (err) {
      console.error(err);
      alert("投稿に失敗しました: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">借りたい物の投稿</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* タイトル */}
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

        {/* 借りたい物の名前 */}
        <div>
          <label className="font-semibold block mb-1">借りたい物の名前</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
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

        {/* 🖼️ 画像アップロード */}
        <div>
          <label className="font-semibold block mb-2">参考画像(任意)</label>
          <p className="text-sm text-gray-600 mb-2">
            借りたい物のイメージを画像で伝えることができます
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-indigo-50 file:text-indigo-700 
              hover:file:bg-indigo-100
              cursor-pointer"
          />

          {/* プレビュー */}
          {previewUrl && (
            <div className="mt-4 relative">
              <p className="text-sm text-gray-600 mb-2">プレビュー:</p>
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="プレビュー"
                  className="max-w-full max-h-64 rounded-lg border-2 border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 期限 */}
        <div>
          <label className="font-semibold block mb-1">必要な期限</label>
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
            支払える上限(レンタルポイント)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50 font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "投稿中..." : "この内容で投稿する"}
        </button>
      </form>
    </div>
  );
}
