import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>🍪 クッキー・クラッカーを始めよう</h1>
        <nav>
          <Link to="/">ホーム</Link> |{" "}
          <Link to="/settings">設定</Link>
        </nav>
      </header>

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
