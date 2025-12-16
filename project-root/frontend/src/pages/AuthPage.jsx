import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { createUserIfNotExists } from "../lib/user"; // ★追加

export default function AuthPage({ onLogin }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 Googleログインのみ
  const handleGoogleLogin = async () => {
    setMessage("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ★ Firestore にユーザー作成（存在しなければ）
      await createUserIfNotExists(user);

      onLogin(user);
      setMessage("Googleログイン成功！");
    } catch (err) {
      console.error(err);
      setMessage("Googleログイン失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-white shadow-md rounded-lg max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">ログイン</h1>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
      >
        {loading ? "ログイン中..." : "Googleでログイン"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}
