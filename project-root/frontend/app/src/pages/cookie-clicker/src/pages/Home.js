import { useState } from "react";
import cookieImg from "../components/cookie.png"; 

export default function Home() {
  // ✅ Reactの「状態」を使ってカウントを保持
  const [count, setCount] = useState(0);

  // ✅ クリックされたときの処理
  const handleClick = () => {
    setCount(count + 1); // ← クリックされるたびに+1
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <p className="text-xl mb-4">クリックでクッキーを増やそう！</p>
      <img
        src={cookieImg}
        alt="cookie"
        onClick={() => setCount(count + 1)}
        className="w-48 h-48 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
      />
      {/* 🍪 カウント表示 */}
      <p className="mt-6 text-2xl font-semibold">クリック数: {count}</p>
    </div>
  );
}
