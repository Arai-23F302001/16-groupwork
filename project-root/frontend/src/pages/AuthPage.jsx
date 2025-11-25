import { useState } from "react";

export default function AuthPage({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    if (!email || !password) {
      setMessage("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include", // ← 重要: httpOnly cookie を受け取る/送る
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage("ログイン成功！");
        // サーバーがユーザー情報を返すならそれを渡し、なければ email を渡す
        onLogin(data.user ?? { email });
      } else {
        setMessage(data.message || "ログイン失敗");
      }
    } catch (err) {
      console.error(err);
      setMessage("サーバーエラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-white shadow-md rounded-lg max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors ${loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
      >
        {loading ? "ログイン中..." : "ログイン"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${message.includes("成功") ? "text-green-500" : "text-red-500"
            }`}
        >
          {message}
        </p>
      )}

      <p className="mt-6 text-sm text-gray-500">
        アカウントをお持ちでない方は{" "}
        <button
          type="button"
          onClick={() => onSignup(email, password)}
          className="text-blue-500 hover:underline"
        >
          サインアップ
        </button>
      </p>
    </div>
  );
}
