import React, { useEffect, useState } from "react";
import { User, Camera, Eye, EyeOff, Check } from "lucide-react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";

export default function ProfileSettings() {
  // ===== Firebaseから取得するポイント =====
  const [points, setPoints] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  // ===== プロフィール情報 =====
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: null,
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ===== ログイン中ユーザーの情報 & ポイント取得 =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setCurrentUserId(user.uid);
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setProfile((prev) => ({
          ...prev,
          name: data.name ?? "",
          email: user.email ?? "",
          bio: data.bio ?? "",
          avatar: data.avatarUrl ?? null, // Cloudinaryから取得したURL
        }));
        setPoints(data.points ?? 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🖼️ 画像を圧縮
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5, // プロフィール画像は500KB以下に
      maxWidthOrHeight: 800, // プロフィール画像は800pxで十分
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
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET_PROFILE;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinaryの設定が見つかりません。.envファイルを確認してください。"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "profile_images"); // プロフィール画像用フォルダ

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

  // ===== 画像アップロード =====
  const handleImageUpload = async (e) => {
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

    setUploading(true);

    try {
      // ローカルプレビュー表示(即座に反映)
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);

      // 画像を圧縮
      console.log("📸 画像を圧縮中...");
      const compressedImage = await compressImage(file);

      // Cloudinaryにアップロード
      console.log("☁️ Cloudinaryにアップロード中...");
      const imageUrl = await uploadToCloudinary(compressedImage);
      console.log("✅ アップロード完了:", imageUrl);

      // Firestoreに保存
      if (currentUserId) {
        const userRef = doc(db, "users", currentUserId);
        await updateDoc(userRef, {
          avatarUrl: imageUrl,
        });
      }

      // プロフィールを更新
      setProfile({ ...profile, avatar: imageUrl });

      alert("プロフィール画像を更新しました!");
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      alert("画像のアップロードに失敗しました: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // ===== 保存 =====
  const handleSave = async () => {
    if (!currentUserId) {
      alert("ログインしてください");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUserId);
      await updateDoc(userRef, {
        name: profile.name,
        bio: profile.bio,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      alert("プロフィールを更新しました!");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">プロフィール設定</h1>
            <p className="text-blue-100 mt-2">アカウント情報を編集できます</p>
          </div>

          <div className="p-8 space-y-8">
            {/* ===== ポイント表示 ===== */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-white shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">あなたのポイント</p>
                <p className="text-2xl font-bold">{points} pt</p>
              </div>
              <span className="text-3xl">⭐</span>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <label
                  className={`absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg ${
                    uploading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-100"
                  }`}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-gray-700" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && (
                <p className="mt-2 text-sm text-gray-600">アップロード中...</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                名前
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                メールアドレスは変更できません
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                プロフィール文章
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows="4"
                placeholder="自己紹介を書いてください..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">パスワード変更</h2>
              <p className="text-sm text-gray-600 mb-4">
                ⚠️ パスワード変更機能は今後実装予定です
              </p>

              {["current", "new", "confirm"].map((field, i) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    {i === 0
                      ? "現在のパスワード"
                      : i === 1
                      ? "新しいパスワード"
                      : "新しいパスワード(確認)"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      value={password[field]}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          [field]: e.target.value,
                        })
                      }
                      disabled
                      className="w-full px-4 py-3 border rounded-lg pr-12 bg-gray-50 text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      disabled
                    >
                      {showPassword[field] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save */}
            <div className="flex justify-end gap-4 items-center">
              {saved && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Check className="w-5 h-5" />
                  保存しました
                </div>
              )}
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                変更を保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
