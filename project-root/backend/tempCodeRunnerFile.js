import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Reactのポート
  credentials: true
}));

// ダミーユーザー
const users = [];

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "必須" });

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "登録済みです" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });

  res.json({ message: "サインアップ成功", user: { email } });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "ユーザーがいません" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "パスワード間違い" });

  res.cookie("session", "dummy-token", { httpOnly: true });
  res.json({ message: "ログイン成功", user: { email } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
