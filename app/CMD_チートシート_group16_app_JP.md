# Vite + React + Tailwind (v4) プロジェクト CMD チートシート

**対象ディレクトリ:** `C:\Users\11647\Desktop\group16\app`

## ディレクトリ/ナビゲーション
```
cd C:\Users\11647\Desktop\group16\app
cd ..
echo %cd%
dir
dir src
```

## ファイルを開く/編集（メモ帳）
```
notepad index.html
notepad src\main.tsx
notepad src\App.tsx
notepad src\DemoJP.tsx
notepad src\index.css
notepad postcss.config.cjs
notepad tailwind.config.cjs
```

## ファイル内容を確認（読み取り専用/自己診断）
```
type index.html
type src\main.tsx
type src\App.tsx
type postcss.config.cjs
type src\index.css
```

## 開発サーバーの起動/停止
```
npm run dev      # 起動（このウィンドウは閉じない）
# 停止は Ctrl+C → Y
```

## ブラウザでローカルサイトを開く
```
start "" http://localhost:5173/
start msedge http://localhost:5173/
start chrome http://localhost:5173/
```

## 依存関係（インストール/修復）
```
npm i
npm i react@18.3.1 react-dom@18.3.1
npm i -D @types/react @types/react-dom
npm i -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

## クリーン再インストール
```
rmdir /s /q node_modules
del /f package-lock.json
npm i
```

## Tailwind v4 / PostCSS 必須設定
**postcss.config.cjs**
```js
module.exports = { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } };
```

**src/index.css**
```css
@import "tailwindcss";
```

## 重複ファイルの整理
```
del /f postcss.config.js
del /f tailwind.config.js
del /f src\style.css
del /f src\main.ts
```

## エントリ & ルートコンポーネント確認
**index.html**
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

**src/main.tsx**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)
```

**src/App.tsx**
```tsx
import DemoJP from "./DemoJP";
export default function App() { return <DemoJP />; }
```

## ポート/ネットワークのトラブルシュート
```
npm run dev -- --port 5174
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 3点セット自己診断（ワンコマンド）
```
echo ==== index.html ==== & type index.html
echo ==== main.tsx ==== & type src\main.tsx
echo ==== App.tsx ==== & type src\App.tsx
```

## よくあるエラー → すぐ直す
1. 画面が「素」= CSS が効かない  
   - postcss.config.cjs が '@tailwindcss/postcss' を使用しているか  
   - src/index.css が `@import "tailwindcss";` になっているか  
   - サーバー再起動：`npm run dev`

2. まだ Vite の初期ページが出る  
   - App.tsx が `<DemoJP />` を返しているか  
   - index.html の `id="root"` と main.tsx の `'root'` が一致しているか

3. `'react/jsx-dev-runtime'` が見つからない  
   ```
   npm i react@18.3.1 react-dom@18.3.1
   npm i -D @types/react @types/react-dom
   ```

4. `could not determine executable to run`  
   - ディレクトリ違い。`cd C:\Users\11647\Desktop\group16\app` へ
