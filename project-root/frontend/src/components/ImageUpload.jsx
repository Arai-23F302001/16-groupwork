import { useState } from "react";
import imageCompression from "browser-image-compression";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // あなたのFirebase設定ファイル

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null); // 選択した画像ファイル
  const [previewUrl, setPreviewUrl] = useState(""); // プレビュー用URL
  const [uploadedUrl, setUploadedUrl] = useState(""); // Cloudinaryからの画像URL
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState(""); // 投稿テキスト

  // 画像を選択したとき
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

    // プレビュー表示用
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 画像を圧縮
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // 最大1MBに圧縮
      maxWidthOrHeight: 1920, // 最大幅/高さ
      useWebWorker: true,
    };

    try {
      console.log("元のサイズ:", file.size / 1024 / 1024, "MB");
      const compressedFile = await imageCompression(file, options);
      console.log("圧縮後のサイズ:", compressedFile.size / 1024 / 1024, "MB");
      return compressedFile;
    } catch (error) {
      console.error("圧縮エラー:", error);
      return file; // 圧縮失敗時は元のファイルを返す
    }
  };

  // Cloudinaryにアップロード
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("アップロードに失敗しました");
      }

      const data = await response.json();
      return data.secure_url; // 画像のURL
    } catch (error) {
      console.error("Cloudinaryアップロードエラー:", error);
      throw error;
    }
  };

  // Firestoreに保存
  const saveToFirestore = async (imageUrl) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        text: postText,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });
      console.log("Firestoreに保存完了:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Firestore保存エラー:", error);
      throw error;
    }
  };

  // 投稿ボタンを押したとき
  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("画像を選択してください");
      return;
    }

    if (!postText.trim()) {
      alert("投稿内容を入力してください");
      return;
    }

    setLoading(true);

    try {
      // 1. 画像を圧縮
      console.log("画像を圧縮中...");
      const compressedImage = await compressImage(selectedImage);

      // 2. Cloudinaryにアップロード
      console.log("Cloudinaryにアップロード中...");
      const imageUrl = await uploadToCloudinary(compressedImage);
      setUploadedUrl(imageUrl);

      // 3. Firestoreに保存
      console.log("Firestoreに保存中...");
      await saveToFirestore(imageUrl);

      alert("投稿成功!");

      // フォームをリセット
      setSelectedImage(null);
      setPreviewUrl("");
      setPostText("");
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>画像付き投稿</h2>

      {/* テキスト入力 */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="投稿内容を入力..."
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 画像選択 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "block", marginBottom: "10px" }}
        />

        {/* プレビュー */}
        {previewUrl && (
          <div>
            <p>プレビュー:</p>
            <img
              src={previewUrl}
              alt="プレビュー"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "10px",
                border: "2px solid #ddd",
              }}
            />
          </div>
        )}
      </div>

      {/* 投稿ボタン */}
      <button
        onClick={handleSubmit}
        disabled={loading || !selectedImage || !postText.trim()}
        style={{
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          padding: "12px 30px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        {loading ? "投稿中..." : "投稿する"}
      </button>

      {/* アップロード成功後の表示 */}
      {uploadedUrl && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
          }}
        >
          <h3>投稿完了!</h3>
          <p>画像URL:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: "break-all" }}
          >
            {uploadedUrl}
          </a>
          <img
            src={uploadedUrl}
            alt="アップロード完了"
            style={{
              maxWidth: "100%",
              marginTop: "10px",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
