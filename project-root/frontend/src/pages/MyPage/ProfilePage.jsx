import React, { useEffect, useState } from "react";
import { User, Camera, Eye, EyeOff, Check } from "lucide-react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileSettings() {
  // ===== Cloudinary設定 =====
  const CLOUDINARY_CLOUD_NAME = "dcdyvkt2n";
  const CLOUDINARY_UPLOAD_PRESET = "dd";

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    return data.secure_url;
  };

  // ===== State =====
  const [points, setPoints] = useState(0);

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

  // ===== Firebaseユーザー取得 =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          name: data.name ?? user.displayName ?? "",
          email: user.email ?? "",
          bio: data.bio ?? "",
          avatar: user.photoURL ?? null,
        });
        setPoints(data.points ?? 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // ===== 画像アップロード（Cloudinary） =====
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    try {
      const imageUrl = await uploadToCloudinary(file);

      // ① 画面反映
      setProfile((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      // ② Firestore保存
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        avatarUrl: imageUrl,
      });

      // ③ Firebase Authにも反映（HOMEアイコン用）
      await updateProfile(auth.currentUser, {
        photoURL: imageUrl,
      });
    } catch (err) {
      console.error(err);
      alert("画像のアップロードに失敗しました");
    }
  };

  // ===== 保存（見た目用） =====
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">プロフィール設定</h1>
            <p className="text-blue-100 mt-2">アカウント情報を編集できます</p>
          </div>

          <div className="p-8 space-y-8">
            {/* ポイント */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-white flex justify-between">
              <div>
                <p className="text-sm">あなたのポイント</p>
                <p className="text-2xl font-bold">{points} pt</p>
              </div>
              ⭐
            </div>

            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                  <Camera className="w-5 h-5" />
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
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg"
            />

            {/* Email */}
            <input
              value={profile.email}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-50"
            />

            {/* Bio */}
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border rounded-lg"
            />

            {/* Save */}
            <div className="flex justify-end items-center gap-4">
              {saved && (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  保存しました
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
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
