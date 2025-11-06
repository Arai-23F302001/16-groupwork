import { useState } from "react";

// ✅ App.tsx から受け取る props の型を定義
type AuthPageProps = {
  onLogin: (email: string) => void;
  onSignup: (name: string, email: string) => void;
};

export default function AuthPage({ onLogin, onSignup }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("ログイン成功！");
        localStorage.setItem("token", data.token);

        // ✅ App.tsx にログイン成功を伝える
        onLogin(email);
      } else {
        setMessage(data.message || "ログイン失敗");
      }
    } catch (err) {
      console.error(err);
      setMessage("サーバーエラー");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ログイン</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>ログイン</button>
      <p>{message}</p>
    </div>
  );
}
