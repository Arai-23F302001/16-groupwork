import React, { useEffect, useState } from "react";
import { User, Camera, Eye, EyeOff, Check } from "lucide-react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileSettings() {
  // ===== Firebaseから取得するポイント =====
  const [points, setPoints] = useState(0);

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

  // ===== ログイン中ユーザーの情報 & ポイント取得 =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setProfile((prev) => ({
          ...prev,
          name: data.name ?? "",
          email: user.email ?? "",
          bio: data.bio ?? "",
        }));
        setPoints(data.points ?? 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // ===== 画像アップロード（ローカル表示のみ） =====
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ===== 保存（今は見た目だけ） =====
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            <p className="text-blue-100 mt-2">
              アカウント情報を編集できます
            </p>
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
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                  <Camera className="w-5 h-5 text-gray-700" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
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
                className="w-full px-4 py-3 border rounded-lg"
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
                className="w-full px-4 py-3 border rounded-lg bg-gray-50"
              />
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
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* Password */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">パスワード変更</h2>

              {["current", "new", "confirm"].map((field, i) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    {i === 0
                      ? "現在のパスワード"
                      : i === 1
                      ? "新しいパスワード"
                      : "新しいパスワード（確認）"}
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
                      className="w-full px-4 py-3 border rounded-lg pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
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
            <div className="flex justify-end gap-4">
              {saved && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  保存しました
                </div>
              )}
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
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
