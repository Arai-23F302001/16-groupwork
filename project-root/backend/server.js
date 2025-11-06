import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",      // ← あなたのMySQLユーザー名
  password: "password",  // ← あなたのMySQLパスワード
  database: "testdb",    // ← 使用するDB名
});

const SECRET_KEY = "secret123"; // 実際はもっと長いものを.envで管理

// ログインAPI
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "ユーザーが見つかりません" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "パスワードが違います" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
