import React, { useState } from "react";
import { SectionCard } from "../components/Ui";

export default function AuthPage({
  onLogin,
  onSignup,
}: {
  onLogin: (email: string) => void;
  onSignup: (name: string, email: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email);
  }
  function doSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    onSignup(name, email);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <SectionCard
        title="認証（ログイン / 新規登録）"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={`px-3 py-1.5 rounded-xl text-sm ${mode === "login" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            >
              ログイン
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-3 py-1.5 rounded-xl text-sm ${mode === "signup" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
            >
              新規登録
            </button>
          </div>
        }
      >
        {mode === "login" ? (
          <form onSubmit={doLogin} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">メールアドレス</label>
              <input className="w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">パスワード</label>
              <input type="password" className="w-full rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">ログイン</button>
          </form>
        ) : (
          <form onSubmit={doSignup} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">お名前</label>
              <input className="w-full rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">メールアドレス</label>
              <input className="w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">パスワード</label>
              <input type="password" className="w-full rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">登録する</button>
          </form>
        )}
        <div className="mt-3 text-xs text-gray-500">※ デモのため実在の認証は行いません。</div>
      </SectionCard>
    </div>
  );
}
